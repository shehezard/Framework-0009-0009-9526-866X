/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var sharingmanager = {
    
     shareViaEmail: function(filePath)  {
          alert("sending email");
          window.plugins.socialsharing.shareViaEmail(
                            'Sharing Section Report', // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
                            'Section Report',
                            null, // TO: must be null or an array
                            null, // CC: must be null or an array
                            null, // BCC: must be null or an array
                            filePath, // FILES: can be null, a string, or an array
                            sharingmanager.onSuccess, // called when sharing worked, but also when the user cancelled sharing via email. On iOS, the callbacks' boolean result parameter is true when sharing worked, false if cancelled. On Android, this parameter is always true so it can't be used). See section "Notes about the successCallback" below.
                            sharingmanager.onError // called when sh*t hits the fan
                          ); 
     },
     
     
    ShareWithOPtions:function(message,subject,file)
    {
        alert("ShareWithOPtions");
        var options = {
            message: message, // not supported on some apps (Facebook, Instagram)
            subject: subject, // fi. for email
            files:[file], // an array of filenames either locally or remotely
            url: null,
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
            };
            window.plugins.socialsharing.shareWithOptions(options, sharingmanager.onSuccess, sharingmanager.onError);
            
    },
  onSuccess:function()
 {
     alert("Success");
 },
 
 onError:function(error)
 {
     //alert("Error");
     alert("error:" + error);
 }
};


