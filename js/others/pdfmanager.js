/* global RSVP, cordova, $TITLE, common, FileError, jsPDF */

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
    SavePDF: function (pdfOutput) {

        var fileName = "CSiSection_Properties_Report.pdf";
        var promise = new RSVP.Promise(function (resolve, reject) {
            try {


                var directory;

                if (typeof cordova.file.dataDirectory !== "undefined") //ios
                    directory = cordova.file.dataDirectory;
                else
                    directory = cordova.file.externalDataDirectory;

                window.resolveLocalFileSystemURL(directory, function (directoryEntry)
                {

                    directoryEntry.getFile(fileName, {create: true}, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.onwriteend = function (e) {
                                try {
                                    var response = {};
                                    response.status = true;
                                    response.filepath = fileEntry.nativeURL;
                                    resolve(response);
                                   
                                } catch (e) {

                                    var response = {};
                                    response.status = false;
                                    response.message = e.toString();
                                    reject(response);
                                }


                            };

                            fileWriter.onerror = function (e) {
                                var response = {};
                                response.status = false;
                                response.message = e.toString();
                                reject(response);
                            };

                            fileWriter.write(pdfOutput);
                        }, errorHandler.bind(null, fileName));
                    }, errorHandler.bind(null, fileName));
                }, errorHandler.bind(null, fileName));
            } catch (e) {
                var response = {};
                response.status = false;
                response.message = e.toString();
                reject(response);
            }


        });
        return promise;

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
    }
    ;
    common.ShowMessage($TITLE, "Error occurred while saving report:" + msg);
    //alert('Error (' + fileName + '): ' + msg);
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
