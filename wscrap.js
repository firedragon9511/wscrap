const https = require('https');
const http = require('http');
const HelpBuilder = require("./helpBuilder.js").HelpBuilder;
const ArgumentParser = require("./argumentParser.js").ArgumentParser;
//var JSSoup = require('jssoup').default;

const urlTest = "http://businesscorp.com.br/";

function WSCrap (){
    this.regexMatchHREF =  /href=(["'])(?:(?=(\\?))\2.)*?\1/gi // /HREF=("|')([^"]*)("|')[^>]*>/gi ///HREF="([^"]*)"[^>]*>/gi;
    this.regexMatchAction = /action=(["'])(?:(?=(\\?))\2.)*?\1/gi; // /action=("|')([^"]*)("|')[^>]*>/gi; // /action="([^"]*)"[^>]*>/gi;
    this.regexMatchCustomAttribute = "{attribute}=([\"'])(?:(?=(\\\\?))\\2.)*?\\1";
    this.matchQuoteContent = /(["'])(?:(?=(\\?))\2.)*?\1/i; // /\".+\"/i;
    this.matchHTMLComments = /<!--[^>]*-->/gm;
    //this.matchFileName = /[^\\]*\.(\w+)$/

    this.encoding = "utf8";

    this.optionsTemplate = {
        host: "proxy",
        //port: 8080,
        //path: "/",
        headers: {
            
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
        }
      };

    this.RequestWithOptions = (url, callback) => {
        var options = this.optionsTemplate;
        options.host = url;
        console.log(options);
        http.get(options, function(res) {
            console.log(res);
            res.pipe(process.stdout);
          });
    }

    /**
     * @param {String} url
     */
    this.Request = (url, callback) => {
        if(url.startsWith("https://")){
            https.get(url, res => { 
                res.setEncoding(this.encoding);
                res.on('data', data => {
                    callback(data);
                });
            });
        }

        if(url.startsWith("http://")){
            http.get(url, res => { 
                res.setEncoding(this.encoding);
                res.on('data', data => {
                    callback(data);
                });
            });
        }
    }

    /**
     * 
     * @param {String} html 
     */
    this.ScrapComments = (html) => {
        var matches = html.match(this.matchHTMLComments);
        //console.log(matches);
        return matches
    }

    /**
     * 
     * @param {String} html 
     */
    this.ScrapHREFs = (html) => {
        var matches = html.match(this.regexMatchHREF);
        return matches;
    }

    /**
     * 
     * @param {String} html 
     */
     this.ScrapActions = (html) => {
        var matches = html.match(this.regexMatchAction);
        //console.log(matches);
        return matches;
    }

    this.ScrapLinksContaining = (html, str) => {
        var matches = this.ScrapHREFs(html);
        var links = [];
        //console.log(html);
        if(matches == null) return [""];
        matches.forEach(element => {
            var link = element.match(this.matchQuoteContent);
            //console.log(element);
            //console.log(link.indexOf("://"));
            if(link[0].indexOf(str) > -1){
                //console.log( link[0]);
                links.push(link[0]);
            }
        });
        return links;
    }

    this.ScrapActionsContaining = (html, str) => {
        var matches = this.ScrapActions(html);
        var links = [];
        //console.log(matches);
        if(matches == null) return [""];
        matches.forEach(element => {
            var link = element.match(this.matchQuoteContent);
            //console.log(link.indexOf("://"));
            if(link[0].indexOf(str) > -1){
                //console.log( link[0]);
                links.push(link[0]);
            }
        });
        return links;
    }

    this.ScrapContaining = (html, str, attribute) => {
        //console.log(this.regexMatchCustomAttribute.replace("{attribute}", attribute));
        var matches = html.match(new RegExp(this.regexMatchCustomAttribute.replace("{attribute}", attribute), "gi"));
        var links = [];
        //console.log(html);
        if(matches == null) return [""];
        matches.forEach(element => {
            var link = element.match(this.matchQuoteContent);
            //console.log(link.indexOf("://"));
            if(link[0].indexOf(str) > -1){
                //console.log( link[0]);
                links.push(link[0]);
            }
        });
        return links;
    }

    this.ReturnIfNotContains = (str, pattern) => {
        if(str.indexOf(pattern) > -1)
            return "";
        else
            return str;
    }
}

/*new WSCrap().RequestWithOptions(urlTest, (data)=>{
    console.log(data);
});*/

//return;

var randomVal =  "amdoenficvndj8sufne83nsxnmcspw90ms93ns9cnfv84nw8snc";

var help = new HelpBuilder();
help.AddUsage("node wscrap.js -u [URL] [OPTIONS]");
help.AddField("Options:\n");
help.AddParam("\t-h", "Help");
help.AddParam("\t-u", "Specify the URL");
help.AddParam("\t-c", "Extract containing");
help.AddParam("\t-n", "Extract not containing");
help.AddParam("\t-t", "Custom html attribute. Default: href.");
help.AddParam("\t-m", "Extract comments");



if(process.argv.length <= 2){
    console.log(help.ToString());
    return;
}


var argumentParser = new ArgumentParser(process.argv);
if(argumentParser.HasParam("-h")){
    console.log(help.ToString());
    return;
}

console.log(help.GetBanner());



url = argumentParser.GetParamValue("-u", "#error");
contains =  argumentParser.GetParamValue("-c", "");
rtype = argumentParser.GetParamValue("-t", "href");;
notContains = argumentParser.GetParamValue("-n", randomVal);;


var scraper = new WSCrap();
scraper.Request(url, (data)=>{
    

    var result;

    result = scraper.ScrapContaining(data, contains, rtype);
    if(argumentParser.HasParam("-m")){
        if(argumentParser.HasParam("-s")){
            console.log(data);
        }
        result = scraper.ScrapComments(data);
        //return;
    } else {
        //result = scraper.ScrapContaining(data, contains, rtype);
    }

    result.forEach(element => {

        if(randomVal == notContains){
            console.log(element.replace(/"/gi, ""));
        }
        else{
            var v = scraper.ReturnIfNotContains(element.replace(/"/gi, ""), notContains);
            if(v != "")
                console.log(v);
        }
    });

});


return;
