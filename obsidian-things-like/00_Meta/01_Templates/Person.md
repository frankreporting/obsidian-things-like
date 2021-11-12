<%*
const name = /^@/.test(tp.file.title) ? tp.file.title.replace("@","") : tp.file.title;
tR += '---\nid: ' + tp.date.now("YYYYMMDDHHmmssSSS") + '\nalias: "@' + name + '"\n---'
await tp.file.move('80_PKM/85_People/' + name)
%>
*<% tp.file.cursor(0) %>*

Twitter::   [@](https://twitter.com/)
Phone::     [](tel:)
Email::     
Affiliation:: 

## Notes & Interactions

- 