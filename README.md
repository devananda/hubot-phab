# Hubot Phabricator Integration

Auto-reply with descriptions and links to phabricator objects.  Also see what tasks are assigned to who.

Based on `hubot-phabricator` and translated into JS

## Installation

`npm install hubot-phab`

Then add `"hubot-phab"` to `external-scripts.json`

## Configuration

`HUBOT_PHABRICATOR_USER` - Required username for your phabricator instance, should match your certificate

`HUBOT_PHABRICATOR_CERT` - Required certificate for your phabricator instance (you can extract it from your `~/.arcrc`)

`HUBOT_PHABRICATOR_API` - Required URL for your API endpoint, e.g. `https://secure.phabricator.com/api/`

`HOME` - Required to be set (get a join error if it's not set... say if you were running hubot via Upstart or something).

## Commands

Hubot will listen for you mentioning something that sounds like a phabricator object, and will attempt to expand upon it.

## Examples

    <matt> Hey, I just submitted D1234, could everyone take a look?
    <hubot> ^ D1234: do awesome things that would be specified better in a real differential - https://secure.phabricator.com/D1234

    <matt> It has to do with fixing up something from rAPPacd334 from last week.
    <hubot> ^ rAPPacd334: overly hasty commit to fix T4321 - https://secure.phabricator.com/rAPPacd334

    <matt> hubot show matt tasks
    <hubot> Showing Open Tasks for Matt Martz (matt.martz)
    <hubot> * T81 - Refactor Code: http://phab.amida-tech.com/T81
	<hubot> * T92 - Bot improvements: http://phabricatorlink/T92

	<matt> hubot set oehokie as alias for matt
	<hubot> Ok, I'll remember matt is also known as oehokie

	<matt> hubot get alias for matt
	<hubot> matt is also known as oehokie

	<matt> hubot show oehokie tasks
	<hubot> Showing Open Tasks for Matt Martz (matt.martz)
    <hubot> * T81 - Refactor Code: http://phab.amida-tech.com/T81
	<hubot> * T92 - Bot improvements: http://phabricatorlink/T92

## Coming soon (?, in my free time)
	- [ ] Close Tasks with `hubot close T81`
	- [ ] Close Tasks with comment ala `hubot close T12 with comment closing because it's done
	- [ ] Commenting on tasks... `hubot comment T12 this is the comment part of it