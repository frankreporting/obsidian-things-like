# Obsidian "Things"-like

*This is a vault demonstrating project and task management in Obsidian using an approach inspired by [Things for Mac](https://culturedcode.com/things/).* This approach requires a number of plugins and CSS snippets (which should all be included in this vault). I should also note the CSS is specific to the Minimal Theme. 

## Why?

I got used to the way Things for Mac helped me organize my projects and tasks, but I've always hated the frequent context switching. I wanted a similar way to navigate my folders and notes without as much need for the mouse or trackpad, and I wanted similar shortcuts that made it fast to create area and project folders. It's not perfect by any means, but while I haven't been able to recreate all the features I liked, there are others that Obsidian — with notable help from plugins like Templater, Dataview, customJS, QuickAdd, and MetaEdit — does better in my opinion: namely, the ability to make any note a task and any task a note.

## Demo

![](obsidian-things-demo.mp4)

## Views

I've attempted to recreate some of the core concepts you'd find in Things, including "Today," "Upcoming," and similar views; creating a Dashboard that acts like a front-end interface for all my folders, notes and tasks; organizing everything by area and project, and navigating my vault mostly by keyboard. 

## Folder Notes

The idea here (with an implementation also inspired by the Folder Note plugin) is that I want to be able to browse my vault via keyboard without using the File Explorer, so every folder has an equivalent note listing its contents. 

Top-level folders are considered "Areas" in Things-speak. Sub-folders can also be areas, or they can be projects. The type is indicated with the tag `#project` or `#area`. Each folder, whether area or project, contains a note that takes an underscore as the first character to keep it at the top of the list (helpful especially for mobile navigation): i.e. `_Area 51.md`. 

A folder note has a `display` property in its frontmatter so that it has a friendlier appearance when rendered using Dataview, and I use a particular dot-driven approach in the alias so that it's faster to find what I'm looking for in search — a `🗃` emoji indicates an area and  `⭕️` is a project, and then the hierarchy reflecting the path to the note, like `⭕️ work.Employer1.Project Name`.

## Dataview and Notes as tasks

There are plenty of plugins available for task management. I just found that I enjoyed having more control over how everything worked, and I wanted to preserve the idea that a task can *contain* information, like in Things, but also like in Notion, where every record in a database is also a text-like file that can be further nested. 

My particular solution relies on Dataview to render notes that are tagged `#task` and then using a customJS script and the MetaEdit API to create a checkbox next to each item rendered by Dataview. The checkbox fires the custom script, which I've written to allow for repeating tasks. So if you mark a regular task complete, it simply gets a `completed` date in its frontmatter, end of story. If it's repeating, then the script looks at the last repeated date and calculates when it should surface next, updating the frontmatter accordingly. If you uncheck a repeating task, it should also attempt to roll back to the previous start and due dates (although it's not working in the demo).

## Limitations 

This approach still has some notable limitations: 

- **No notifications or reminders:** In the rare instances I need recurring, time-sensitive alerts, I still use Things, though I am considering finally embracing Apple's built-in reminders, since this is a small piece of my overall workflow.
- **Not updated for CodeMirror 6 and Live Preview:** This demo still relies on CM5 and the CodeMirror Options plugin to get the WYSIWYG-like experience in the editor. I plan to update to make it play nicely with LP.

## Plugins Required:

- Dataview
- Templater
- CustomJS
- QuickAdd
- MetaEdit
- CodeMirror Options

I use a lot more plugins than that, so if your layout doesn't look or function exactly like mine, it could be because of a plugin conflict, or you're on a different theme, or because of some CSS snippets I use, etc.

## Key Scripts

The scripts you need to make this work should all be included in `00_Meta/07_Scripts` or ..`08_QuickAdd`. The critical ones are:

- `07_Scripts/dvTasks.js`
- `07_Scripts/markTask.js`
- `08_QuickAdd/markCompleted.js`

There are two scripts driving the ability to mark tasks complete in rendered Dataviews. One powers the checkboxes. The QuickAdd script powers a macro that is tied to a command, so it can also be mapped to a keyboard shortcut on desktop. (QuickAdd scripts weren't working on mobile as of this demo.)

## A Word of Caution

This whole setup could break or become obsolete at any time, given the pace of updates from the makers of Obsidian and its developer community. You should also test it in a non-production vault before attempting to integrate any of this on your real files. Don't want anyone losing important data on my account!

I should also say this will probably be updated frequently as I experiment with new features. I do not consider this system finished, and I also need a vault to try things myself before putting *my own* important files at risk.

## Roadmap

I tend to keep a running list of future ideas for improvement in `Today.md`. Just expand the admonition there to see it.