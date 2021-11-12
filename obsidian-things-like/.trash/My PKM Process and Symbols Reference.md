---
id: 202107211711204
alias: § My PKM Process and Symbols Reference
tags: MOC, subject
---
area:: [[_Subjects|🗃 PKM.Subjects]]

# My (old) PKM process

## To Do

- [x] Set up template to move § index files to `31_Index`
- [x] See if you can do an empty note template that checks the title (or alias) and applies *another* template upon creation
  - i.e. if it's @Somebody then it would treat them as a Person and apply the person template
- [ ] Figure out why Templater isn't working on mobile
- [ ] Set up another to similarly handle source notes… don’t recall what I meant by this, but maybe a logic check to see if `¶` is in the title, and then run the templater to insert frontmatter? But that is still all handled by the Citations plugin, I think?
- [ ] Consider updating dailyNoteLog method so events section displays multi-day events on the relevant dates, i.e. [[2021-03 News Product Alliance Summit 2021]]
  - alternately, I could make it a habit to do one event per day, i.e. "NPA Summit Day 1/2/3" etc.
- [x] Update/link Citations plugin to Zotero

## Folder Structure

This is ever-changing, so I'm not sure it makes sense to codify this yet

## File and Folder Naming Conventions

|     | Type        | Alias             | Location          | Keystroke                      |
| --- | ----------- | ----------------- | ----------------- | ------------------------------ |
| ¶   | Source Note | `¶SourceNote`     | `33_Source_Notes` | `option-7`                     |
| @   | Person      | `@Person`         | `34_People`       | `shift-2`                      |
| §   | Subject     | `§ Subject`       | `31_Index`        | `option-6`	                     |
| ⦿   | Project     | `⦿ {area}.{name}` | project folder    | `U+29BF` ("circled bullet")    |
| ⌘   | Area        | `⌘ Area Name`     | anywhere          | `U+2318` ("place of interest") |

- Title prefixed with symbol in the alias but not in the filename itself
  - This makes the Quick Open menu more organized and helps you filter to a specific note type simply by typing the prefix key
  - i.e. `@Name` will show up in the list with the folder path underneath, vs. showing the full folder path for every file, `30_PKM/34_People/@Name`
- When a project is complete, consider removing the prefix from the file name, or else the alias
- Try to use symbols that are available on iOS emoji/symbol keyboard for easier access

## Maps of Content

I'm not currently using a dedicated symbol for a [[Map of Content]].  I'm thinking of a MOC as a general approach, more an umbrella term for the habit of forming indices to gather content. Underneath the umbrella concept, I track subjects, areas,  and projects.

## Subjects 

A subject is any concept or thing, general or specific, where I have amassed a lot of notes and information. Some might consider this a more traditional "map of content" in personal knowledge management systems. I differentiate these from projects and areas, where I am specifically trying to wrangle more actionable information. In some ways, I think I am already gravitating toward using them as the highest level in the hierarchy. For instance, a subject for rounding up Task notes could also contain Projects and Areas.

## Areas vs. Projects vs. Tasks

- Projects get a `project` tag in frontmatter and generally get assigned to an area via inline [[Dataview]] field, i.e. `area::[[link-to-area]]`
- Tasks get a `task` tag in frontmatter and get assigned to a project or area via inline [[Dataview]] field, i.e. `project:: [[link-to-project]]`
- Areas are more nebulous and any file can qualify at the moment. One area might be `[[Finances]]` and be stored in the `24_Finances` folder, serving as a [[Map of Content]] note for that folder. Another might be `[[KPCC]]` and be an entity note with address, contact info, and other details, with the addition of Dataview lists that automatically organize content that refers to it as an area.
  - This doesn't seem like the most organized approach long-term, but it does keep things flexible for now. I'm also not a fan of nesting folders under more nested folders just to categorize things. I'd rather have a more flat approach that relies on metadata and visual cues, like the symbols listed above, to help me identify what's what.
  - For now, I think I'll just keep an [[Areas]] index.

## Other symbols of interest

∑ `option-W`
 `shift-option-K`
∞ `option-5`
_ `shift-dash`
© `option-G`

## Symbols to avoid

Ω - occurs *after* numbers and letters alphabetically