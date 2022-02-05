exports.HelpBuilder = function(){
    var data = [];

    var banner = `
    __    __  _____   __  ____    ____  ____  
    |  |__|  |/ ___/  /  ]|    \\  /    ||    \\ 
    |  |  |  (   \\_  /  / |  D  )|  o  ||  o  )
    |  |  |  |\\__  |/  /  |    / |     ||   _/ 
    |  \`  '  |/  \\ /   \\_ |    \\ |  _  ||  |   
     \\      / \\    \\     ||  .  \\|  |  ||  |   
      \\_/\\_/   \\___|\\____||__|\\_||__|__||__|   
    
    --------[[ By: firedragon9511 ]]--------
    `; // --------- By: firedragon9511 ------------

    this.GetBanner = () => {
        return banner  + "\n"  ;
    }

    this.AddUsage = (usage) => {
        data.push("Usage:");
        data.push("\t" + usage);
        data.push("");

    }


    this.AddField = (str) => {
        data.push(str);
    }

    this.AddParam = (param, description) => {
        data.push(param + "\t\t" + description)
    }

    this.ToString = () => {
        return banner + "\n\n\n" + data.join("\n") + "\n";
    }

}