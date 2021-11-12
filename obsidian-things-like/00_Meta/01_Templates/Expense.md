<%*
const prompt = await tp.system.prompt("Enter an expense:")
await tp.file.move("/10_Personal/14_Finances/" + prompt)
%>
---
id: <% tp.date.now("YYYYMMDDHHmmssSSS") %>
tags: expense
amount: <% tp.file.cursor(0) %>
recurs: 
---
area:: [[_Finances]]
account:: 
due:: 
link:: [🔗]()