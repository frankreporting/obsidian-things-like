<%*
const logDate = tp.file.title.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/)[0];
const cleanTitle = tp.file.title.replace(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/,"").trim();
const friendlyDate = tp.date.now("M/D/YY", 0, logDate, "YYYY-MM-DD");
tR += "---\nid: " + tp.date.now("YYYYMMDDHHmmssSSS") + "\nalias: " + friendlyDate + " " + cleanTitle + "\ntags: log\n---\n";
if (tp.file.folder != '/00_Meta/06_Logbook/') {
	await tp.file.move("/00_Meta/06_Logbook/" + tp.file.title)
}
tR += `area:: ${tp.file.cursor(0)}\n\n`;
tR += `# ${cleanTitle}\n\n`;
tR += `Topic:: \n`;
tR += `When:: [[${logDate}|${tp.date.now("dddd", 0, logDate, "YYYY-MM-DD")}]]\n`;
tR += `Who:: \n\n`
tR += `## Notes:\n\n`
tR += `- \n`
%>