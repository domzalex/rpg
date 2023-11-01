NOTE:
This app includes a Tauri configuration but is not needed to run.
App can be run locally via VSCode live server or other means.


Controls:
WASD to move character
E to open menu
Escape to close menu/navigate backwards through menu trees
Enter to select options/interact with non-player characters (currently not implemented due to testing)

NOTE:
There is code for external gamepad controls, but it is not compeletely stable as of yet and should not be relied on.


Gameplay:
Can walk around playable area and collide with various sprite blocks
Entering the patch of dense grass can trigger a random turn-based battle sequence with one of three different enemies
Each enemy has a 'type': grass, water, neutral and each 'type' corresponds to a certain elemental weakness: grass; fire magic, water; lightning magic, neutral; wind magic
Player can fight enemies, heal in and out of battle, get items from enemies defeated, and gain currency from enemies defeated
After a certain amount of 'exp' is earned from fighting, your character will 'level up' and their stats will increase


NOTE:
This project has been ongoing for years, so there is wild inconsistencies with the quality of the code and the Git log does not accurately represent the timeline of the code as it includes various mechanics developed years ago and some things have been refactored to be more readable (notably, the classes.js file and the external gamepad logic). There is much code to be refactored, but hopefully this will give a good enough idea of the general logic and flow of the mechancis.
