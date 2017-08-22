var DataModule = angular.module("DataModule", ['LoggingModule']);

DataModule.factory("DataFactory", function(Logging) {
    var factory = {};

    factory.decrypted = null;
    factory.VoterJSON = null;

    factory.decryptData = function(phrase) { //AES to Plaintext
        if (factory.decrypted == null) {
            try {
                factory.decrypted = CryptoJS.AES.decrypt(EncryptedVoterData, phrase).toString(CryptoJS.enc.Utf8);
            } catch(err) {
                alert("Invalid passphrase entered. Please try again.");
                return;
            }
            if(factory.decrypted.substr(0, 8) != "99099375") {
              factory.decrypted=null;
            } else {
              Logging.log("Voter Data Decrypted.", 0)
            }
        }
        return (factory.decrypted != null);
    }

    factory.getVoterFromVid = function(id) {
        for(var i = 0; i < factory.VoterJSON.length; i++) {
          if (factory.VoterJSON[i].VOTERID === id) {
            return factory.VoterJSON[i];
          }
        }
    }

    factory.parseToJSON = function() { //Transforms the entire decrypted CSV plaintext into a JSON array.
        if (factory.decrypted) {
              //Fucking data:text/csv;base64 fuck you
              var currentIter = 0;
              factory.VoterJSON = []
              var words = factory.decrypted.split(',');
              for (var i = 0; i < words.length; i+=14) { //First 14 are HEADER VALUES, actual data starts from 15
                  factory.VoterJSON[currentIter] = {
                    'VOTERID': words[i],
                    'FIRSTNAME':words[i+1],
                    'LASTNAME':words[i+2],
                    'GENDER':words[i+3],
                    'PHONE':words[i+4],
                    'PARTY':words[i+5],
                    'ADDR_NUM':words[i+6],
                    'ADDR_DIR':words[i+7],
                    'ADDR_STR':words[i+8],
                    'ADDR_TYPE':words[i+9],
                    'ADDR_OTHER':words[i+10],
                    'ADDR_CITY':words[i+11],
                    'ADDR_STATE':words[i+12],
                    'ADDR_ZIP':words[i+13]
                  }
                  currentIter++;
              }
          }
          Logging.log((currentIter + 1) + " Voters Parsed & JSONified.", 0)
    }


    factory.getVoterJSON = function() { //Transforms the entire decrypted CSV plaintext into a JSON array.
          return factory.VoterJSON;
    }

    factory.getDecryptedData = function() {
      return factory.decrypted;
    }

    Logging.log("Data Factory Loaded.", 0)
    return factory;
});
