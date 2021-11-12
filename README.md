# Obsidian "Things"-like

*This is a vault demonstrating project and task management in Obsidian using an approach inspired by Things for Mac.*

## Why?

I really enjoy using Things for Mac to manage my tasks, but I've always hated the frequent context switching needed when you have a separate app for notes, not to mention having to duplicate some info via copy/paste to ensure it's accessible from my main notebook. Obsidian to the rescue!

I've attempted to recreate some of the core concepts you'd find in Things, including views like "Today" and "Upcoming," organizing everything by area and project, and navigating my vault mostly by keyboard. It has some notable limitations: 

- **No notifications or reminders:** In the rare instances I need recurring, time-sensitive alerts, I still use Things, though I am considering finally embracing Apple's built-in reminders, since this is a small piece of my overall workflow.
- **QuickAdd menu item to mark a task complete doesn't work on mobile:** This is because QuickAdd scripts don't work on mobile (here's hoping they will in the future!). I'm considering adding a giant checkbox or button in my task template that activates the mark complete so you can just tap it. This could work since you can access customJS scripts via Dataview.

## Plugins Required:

- Dataview
- CustomJS
- QuickAdd
- MetaEdit

I use a lot more plugins than that, so if your layout doesn't look or function exactly like mine, it could be because of a plugin conflict, or you're on a different theme, or because of some CSS snippets I use, etc.

## Key Scripts

The scripts you need to make this work should all be included in `00_Meta/07_Scripts` or ..`08_QuickAdd`. The critical ones are:

- `07_Scripts/dvTasks.js`
- `07_Scripts/markTask.js`
- `08_QuickAdd/markCompleted.js`

## Folder Notes

The idea here (with an implementation also inspired by the Folder Note plugin) is that I want to be able to browse my vault via keyboard without using the File Explorer, so every folder has an equivalent note listing its contents. 

Top-level folders are considered "Areas" in Things-speak. Sub-folders can also be areas, or they can be projects. The type is indicated with the tag `#project` or `#area`. Each folder, whether area or project, contains a note that takes an underscore as the first character to keep it at the top of the list (helpful especially for mobile navigation): i.e. `_Area 51.md`. 

A folder note has a `display` property in its frontmatter so that it has a friendlier appearance when rendered using Dataview, and I use a particular dot-driven approach in the alias so that it's faster to find what I'm looking for in search — a `🗃` emoji indicates an area and  `⭕️` is a project, and then the hierarchy reflecting the path to the note, like `⭕️ work.Employer1.Project Name`.

## Dataview and Notes as tasks

There are plenty of plugins available for task management. I just found that I enjoyed having more control over how everything worked, and I wanted to preserve the idea that a task can *contain* information, like in Things, but also like in Notion, where every record in a database is also a text-like file that can be further nested. 

My particular solution relies on Dataview to render notes that are tagged `#task` and then using a customJS script and the MetaEdit API to create a checkbox next to each item rendered by Dataview. The checkbox fires the custom script, which I've written to allow for repeating tasks. So if you mark a regular task complete, it simply gets a `completed` date in its frontmatter, end of story. If it's repeating, then the script looks at the last repeated date and calculates when it should surface next, updating the frontmatter accordingly.

## A Word of Caution

This whole setup could break or become obsolete at any time, given the pace of updates from the makers of Obsidian and its developer community. You should also test it in a non-production vault before attempting to integrate any of this on your real files. Don't want anyone losing important data on my account!

I should also say this will probably be updated frequently as I experiment with new features. I do not consider this system finished, and I also need a vault to try things myself before putting *my own* important files at risk.

# Road Map

I tend to keep a running list of future ideas for improvement in `Today.md`. Just expand the admonition there to see it.