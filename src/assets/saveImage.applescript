-- vscode extension : Paste Image
property fileTypes : {{«class PNGf», ".png"}}

set clipType to getClipType()
set imagePath to "/Users/liqiang/Downloads/applescript_image.png"


if clipType is not missing value then
	try
		set myFile to (open for access imagePath with write permission)
		set eof myFile to 0
		write (the clipboard as (first item of clipType)) to myFile
		close access myFile
		return (POSIX path of imagePath)
	on error
		try
			close access myFile
		end try
		return ""
	end try
else
	return "NOTIMAGE"
end if

on getClipType()
	repeat with type in fileTypes
		repeat with theInfo in (clipboard info)
			if (first item of theInfo) is equal to (first item of type) then return type
		end repeat
	end repeat
	return missing value
end getClipType