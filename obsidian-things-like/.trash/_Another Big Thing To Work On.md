---
id: 202105211008002
aliases: ⭕️ KPCC.Source Tracker
display: Source Tracker
tags: project
---
# Source Tracking for KPCC+LAist

area:: [[_KPCC|🗃 Work.KPCC]]
start:: [[2021-08-31]]
due:: [[2021-09-30]]
completed::
related:: [[_Merlin|⭕️ Work.KPCC.Merlin]], [[Set up Source Diversity Task Force]]

---

## Roadmap

[Source Tracker: FY22 Roadmap](https://docs.google.com/document/d/1iAhS8kWy_FqZ8zQK-Z40ciFDA9Q_mYKMnTMqm1ROIa0/edit#)

## To Do

- [ ] [[Get legal advice from attorney Michael Lewis on Source Tracker]] 
- [ ] [[Source Survey Language]]
- [ ] [[DEI dashboard for real-time reporting]]
- [x] Create email-able survey form

## Strategy and Goals

### GOAL: 50% Latino/a sources by end of FY2022
- see [[2021 SCPR DEI Report and Action Plan]]

### STRATEGY
- Q1 (Jul-Sep 2021): Pilot project, with emphasis on creating a benchmark and collecting data on system performance
- Q2 (Oct-Dec 2021): Refine the source tracking system based on Q1 data and feedback to boost completion rate and improve accountability
- Q3 (Jan-Mar 2022):
  - Develop and implement newsroom-wide tactics to increase Latino sources, i.e. more training, shared resources, building our own diverse sources database, etc.
  - Begin holding people accountable
- Q4 (Apr-Jun 2022): Review and refine tactics

---

[LA/LB/Anaheim metro area demographics from 2019 American Community Survey](https://data.census.gov/cedsci/table?tid=ACSDP5Y2019.DP05&g=310M500US31080):
```json
"data": {
	"values": [
		{"label": "Asian", "estimate": 2125243, "error": 10822, "percent": 16.1},
		{"label": "Black", "estimate": 829224, "error": 8409, "percent": 6.3},
		{"label": "Hawaiian/Pacific Islander", "estimate": 32318, "error": 2435, "percent": 0.2},
		{"label": "Latino/a", "estimate": 5963061, "error": ****, "percent": 45.1},
		{"label": "Native American/Indigenous", "estimate": 29631, "error": 2192, "percent": 0.2},
		{"label": "Other", "estimate": 46196, "error": 7329, "percent": 0.3},
		{"label": "White", "estimate": 3857886, "error": 4049, "percent": 29.2}
  ]
}
```
Note: "Not Hispanic or Latino" subcategories are used for white, black, Asian, Native American, Hawaiian/PI, and Other.

Same demographics as related in DEI Report:
![](https://i.imgur.com/iJEXeOx.png)
Note: Discrepancy with my data above. 0.4% was not listed anywhere in the Census table that I could see. Not sure if it's a sum of something else, but I opted for the Non-Hispanic "Other" subcategory, which is only 0.3%.

## Milestones

- [[2021-07-13]]: Rolled out new source diversity tracker in Merlin (could be helpful to compare before/after participation)

## Open Questions

- [ ]  Should we consider a page on LAist/KPCC websites with disclaimer copy and explanation of project? Possibly include:
  - link where people can request their name be removed from our system
  - recent progress reports for public consumption
- [ ] Consider making printable cards like the NPR example [here](https://training.npr.org/wp-content/uploads/diversity-script.pdf)
  - in future possibly 2 versions? One for reporter and one to hand to sources with link to survey? This might require a second base strictly for source contributions so we can vet before bringing into Merlin
- [x] Data analysis question: When a source interview drives multiple posts over 2 months (end/beginning of month), which month do we count it for, or both?
  - currently counting it for 2nd month (the most recent published/aired assignment)

## More Links and Resources

- [Activities for Axel and modifications to survey questions](https://docs.google.com/document/d/1LJDwy299aYvQy-OP1kmQKRlXnfgj75xrnOQoTGxiVLs/edit#)
- [KPCC/LAist Source Diversity Report - FY22 Q1 (DRAFT)](https://docs.google.com/document/d/1OzdJQVmadBhs1Swp-abNK81w5Skz7-MUrkxC12dK22k/edit#)
- [Tracker Report: March 2021](https://docs.google.com/document/d/18fXT25gvdUVjiIwQWn35lJK_P4EvryrNf8P5EQOE3E0/edit?ts=608706b6)
- [KPCC + LAist Source Tracking (Response SHEET)](https://docs.google.com/spreadsheets/d/1JcTPMA1OLVUVpEjlPEGgiLyC8SNhrP5Qk0mRfIR2R4s/edit?ts=60870645#gid=1817623675)
- [KPCC + LAist Source Tracking (Response FORM)](https://docs.google.com/forms/d/1cn8785x6ZeF9VnB7QCfQBr2QTYDLmvhKURJA35L0b7E/edit?ts=60870613#responses)
- [Shareable form](https://docs.google.com/forms/d/e/1FAIpQLSfxxv9has70TCJ3ozPaz4Lsi9ohpNHgXGf5UQVqVwxoGo7K6Q/viewform)
- [[202104231108 Template for new Source Tracker]]
- [April tracker report](https://docs.google.com/document/d/14LHdgTcwZkIVr5ugqsRINBS-si6M5zK4p0GVFEd_3Yo/edit)
- [April data](https://docs.google.com/spreadsheets/d/1yj9Zje2OZnOxDmZEN6Z1PKPp5e7n6PrZOTdX1-lZ2kU/edit)
- [[202105111459563|April source tracking]]
- [[Merlin 2.0 training deck]]

## Completed

- [x] [[Initial Source Tracker implementation in Merlin]]

## Ideas

- standardized survey form to share with sources — h/t [[@Kyle Stokes]]
  - reporters/producers might need to manually review/connect to slugs in Merlin
- biz card with survey Q's and/or link to that survey for "run and gun" situations — h/t [[@Kyle Stokes]]
  - wonder if we could make a bit.ly short url like `kp.cc/diversity`?
- reduce questions

## Report Types

- [ ] list count and % of total for each:
  - tracker participation rate by platform
  - all sources by race (compared to LA County pop.)
  - all sources by gender
  - all sources by sexual orientation
  - sources by race and function
  - all entries by beat
  - all sources by race and beat
  - total source entries by platform

- [ ] Take Two and AirTalk breakouts:
  - all sources by race and beat
  - all sources by race and function

- [ ] format counts (need merlin)
  - use total as divisor for participation rate