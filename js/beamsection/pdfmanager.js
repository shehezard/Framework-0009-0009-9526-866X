/* global cordova, jsPDF */

var pdfmanager = {
    createPDF: function () {
        var doc = new jsPDF();
        doc.text(20, 20, 'Hello world!');
        doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
        doc.addPage();
        doc.text(20, 20, 'From within Cordova.');
        var uristring = doc.output();
        return uristring;
    },
    SavePDF: function (pdfOutput, fileSaved) {


        var fileName = "Section Prop Report.pdf";
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry)
        {

            directoryEntry.getFile(fileName, {create: true}, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        //alert('Write of file "' + fileName + '"" completed.');
                        try {
                            //  alert(fileEntry.nativeURL);
                            fileSaved(fileEntry.nativeURL); //call back
                            //  cordova.plugins.fileOpener2.open(fileEntry.nativeURL,'application/pdf',
//                            { 
//                                error : function(e) { 
//                                    alert('Error status: ' + e.status + ' - Error message: ' + e.message);
//                                },
//                                success : function () {
//                                    alert('file opened successfully');                
//                                }
//                            }
//                            );
                            //var ref = window.open(fileEntry.nativeURL, "_blank", "EnableViewPortScale=yes,location=no,disallowoverscroll=yes,allowInlineMediaPlayback=yes,toolbarposition=top,transitionstyle=fliphorizontal");
//                          window.plugins.socialsharing.shareViaEmail(
//                            'Here is Android Share', // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
//                            'Android Share',
//                            'jonathan.jfm@gmail.com ', // TO: must be null or an array
//                            null, // CC: must be null or an array
//                            null, // BCC: must be null or an array
//                            fileEntry.nativeURL, // FILES: can be null, a string, or an array
//                            pdfmanager.onSuccess, // called when sharing worked, but also when the user cancelled sharing via email. On iOS, the callbacks' boolean result parameter is true when sharing worked, false if cancelled. On Android, this parameter is always true so it can't be used). See section "Notes about the successCallback" below.
//                            pdfmanager.onError // called when sh*t hits the fan
//                          );

                        } catch (e) {

                            alert('failed: ' + e.toString());
                        }


                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        alert('Write failed: ' + e.toString());
                    };

                    //var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(pdfOutput);
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    },
    onSuccess: function ()
    {
        alert("Success");
    },
    onError: function (error)
    {
        //alert("Error");
        alert("error:" + error);
    }
};
var errorHandler = function (fileName, e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    alert('Error (' + fileName + '): ' + msg);
};
(function (API) {
    API.textAlign = function (txt, options, x, y) {
        options = options || {};
        // Use the options align property to specify desired text alignment
        // Param x will be ignored if desired text alignment is 'center'.
        // Usage of options can easily extend the function to apply different text
        // styles and sizes

        // Get current font size
        var fontSize = this.internal.getFontSize();

        // Get page width
        var pageWidth = this.internal.pageSize.width;

        // Get the actual text's width
        // You multiply the unit width of your string by your font size and divide
        // by the internal scale factor. The division is necessary
        // for the case where you use units other than 'pt' in the constructor
        // of jsPDF.

        var txtWidth = this.getStringUnitWidth(txt) * fontSize / this.internal.scaleFactor;

        if (options.align === "center") {

            // Calculate text's x coordinate
            x = (pageWidth - txtWidth) / 2;

        } else if (options.align === "centerAtX") { // center on X value

            x = x - (txtWidth / 2);

        } else if (options.align === "right") {

            x = x - txtWidth;
        }

        // Draw text at x,y
        this.text(txt, x, y);
    };
    /*
     API.textWidth = function(txt) {
     var fontSize = this.internal.getFontSize();
     return this.getStringUnitWidth(txt)*fontSize / this.internal.scaleFactor;
     };
     */

    API.getLineHeight = function (txt) {
        return this.internal.getLineHeight();
    };

})(jsPDF.API);
