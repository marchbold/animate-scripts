// Reference: https://github.com/AdobeDocs/developers-animatesdk-docs/blob/master/index.md

// Get the current profile
var profileXML = eval( fl.getDocumentDOM().exportPublishProfileString() );
fl.trace( profileXML );

var success = confirm('Do you want to clear the current libraries?');
if (success) 
{
	profileXML..PublishFlashProperties.LibraryPath = '';
}

fl.trace( profileXML..PublishFlashProperties );

var currentEntries = profileXML..PublishFlashProperties.LibraryPath.children();

var folderURI = fl.browseForFolderURL( "Select folder containing ANE or SWC files" );
if (folderURI != null) 
{
	var folderContents = FLfile.listFolder( folderURI );
	folderContents.forEach( function(file) {
		var fileURI = folderURI + "/" + file;
		var filePath = FLfile.uriToPlatformPath( fileURI );
		var fileExt = filePath.substr(filePath.length - 3).toLowerCase();
		var linkage = fileExt === "ane" ? "external" : "merge";

		fl.trace( "filePath: " + filePath );
		fl.trace( "fileExt: " + fileExt );

		var alreadyExists = false;
		for (var i =0; i < currentEntries.length(); i++)
		{
			if (currentEntries[i]["swc-path"] == filePath) 
			{
				fl.trace( "SKIP: " + filePath );
				alreadyExists = true;
				break;
			}
		}
		
		if (!alreadyExists)
		{
			fl.trace( "ADD: " + filePath );
			var entry = <library-path-entry>
			  <swc-path>{filePath}</swc-path>
			  <linkage>{linkage}</linkage>
			</library-path-entry>;
		  
			profileXML..PublishFlashProperties.LibraryPath.appendChild( entry );
		}

	} );

	fl.getDocumentDOM().importPublishProfileString( profileXML.toString() );
}
