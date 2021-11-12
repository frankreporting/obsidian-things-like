<%*
const prompt = await tp.system.prompt("New subject:")
tR += "---\nid: " + tp.date.now("YYYYMMDDHHmmssSSS") + "alias: § " + prompt + "\n---"
%>
<% tp.file.move("80_PKM/83_Subjects/" + prompt) %><% tp.file.cursor(0) %>