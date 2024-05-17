# qwixx
Adapting Qwixx boardgame

Game creator: Steffen Benndor; illustraded by O. & S. Freudenreich

I like this game very much; from my perspective, adapting it for the web is a relevant exercise to learn/refresh about different languages.
Live demo available here: [Play Qwixx](https://qwixx.jboisseur.xyz)

## Version 1 (released!)
Version 1 is a solo version where the goal is to enter a best scores list.

### Features
- Playing Qwixx as the main player
- Beat other's scores

### Pending issues
- lock several lines during last turn should be possible;
- 2 or 3 three elegible cell in a row: uncrossing 2nd or 3rd doesn't make the 1st re-elegible;
- 2 or 3 three elegible cell in a row: selecting white dice sum first renders color dice sum un-elegible;
- case where a cell dosen't get the .deadcell class where it should;
- case where uncrossing allow crossing in a locked line.

### Pending evolutions
- do not show last cell as elegible if there is less than 5 cells crossed out
- show real-time score
- ask of a name only if entering the best scores
- show lock cell

### Deploy on your on server
**Requirements**
- you should have PHP enabled
- you should set up a daily cron job to run reset.php (daily best scores)
- you should have permissions to write on json files

**How-to**
Verify requirements, then copy files from root (except README.md) and you should be fine &#128522;

## Version 2
2 players on client side

## Version 3
2 players on server side, choose pen color for crossing cells

## Version 4
Up to 5 players on server side, choose different crossing-style (fill, hatch...), choose displaying elegibility or not