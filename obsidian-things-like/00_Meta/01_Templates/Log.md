<%*
const logDate = tp.file.title.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/)[0];
const cleanTitle = tp.file.title.replace(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/,"").trim();
const friendlyDate = tp.date.now("M/D/YY", 0, logDate, "YYYY-MM-DD");
tR += "---\nid: " + tp.date.now("YYYYMMDDHHmmssSSS") + "\nalias: " + friendlyDate + " " + cleanTitle + "\ntags: log\n---";
if (tp.file.folder != '/00_Meta/06_Logbook/') {
	await tp.file.move("/00_Meta/06_Logbook/" + tp.file.title)
}
%>
# <% cleanTitle %>

Topic:: <% tp.file.cursor(0) %>
When:: [[<% logDate %>|<% tp.date.now("dddd", 0, logDate, "YYYY-MM-DD") %>]]
Who:: 

## Notes:

- 