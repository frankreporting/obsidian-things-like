<%*
var desiredPath = "00_Meta/06_Logbook"
if (tp.file.title.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) !=-1)
{
	let dailyNoteContent = await tp.file.include("[[Daily Note]]")
	tR += dailyNoteContent;
	if (tp.file.path().includes(desiredPath) != true)
	{
		await tp.file.move("/00_Meta/06_Logbook/" + tp.file.title);
    new Notice("Moved \"" + tp.file.title + "\" to: " + desiredPath)
	}
} else
	{
		tR += "---\n" + "id: " + tp.date.now("YYYYMMDDHHmmssS") + "\n---";
	}
%>