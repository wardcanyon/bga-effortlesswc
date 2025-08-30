- Feedback from Isaac game

  - "Armor: mage hands"

  - attribute order: str, dex, con, int, wis, cha

  - animation sequencing

  - (consider/weak): for effects like City, consider selecting the setloc rather than the pile

  - for crypt/etc., actually show top card of discard?  similarly, for temple, show two face-down cards that are "the
    top of the deck"?

  - treacherous' tooltip is wrong

    - and behavior is wrong, too!

  - need updated obsidian helmet card

  - scoring table section order: armor, items, attributes, settings

  - Isaac using chrome - cards appearing oddly - screenshot in Discord

  - Send Isaac a note about BGA metadata images

  - Isaac will send new logo, new game cover

  - apply for beta & post in BMG discord!

  - Isaac suggests: on iPad, pin player's hand to top so that it's visible when you scroll.  Maybe that'd actually be
    good behavior in general, below a certain resolution (e.g. when using the single-column layout)?

- Blocking stuff

  - (none?)

- High-priority stuff that is not blocking

  - Sequence animation

  - Zombie turn (?) - randomly select from available choices?

  - Write docs

  - Implement game statistics

- Smaller stuff

  - The value-selection bug still exists (but much more rarely?)!

  - UX/client issues

    - Sequence animation a little bit.

  - Scoring table

    - add info icons with tooltips explaining scoring for each section

    - column widths are really wonky; we want equal widths for all of the columns other than the label column on the left

      - just give up and do this with javascript, or inline width styles?

    - text and icons are not vertically aligned; having an icon pushes the text down

- Kickstarter exclusives

  - Isaac to share spreadsheet

- Other

  - Clean up noisy client-side logging.

  - Go through all of the "tmp_*" CSS classes and see if we still need them.

  - When giving their turn to a player, you give them some extra time with the giveExtraTime() function.

  - Game progression is implemented (getGameProgression() in php)

  - Zombie turn is implemented (zombieTurn() in php). Note: it can only be tested if you explicitly click on the quit
    button to create a zombie. If you are expelled it does not generated a Zombie.

    - Zombie turn should just be randomly selecting a visitable location.  Before implementing Zombie behavior, we'll
      need to add an `isVisitable()` member to locations.  We should also use it to improve what we send the client.

    - We need to figure out what to do with decisions other than which location to visit.  Maybe also just a random
      choice?

  - You have defined and implemented some meaningful statistics for your game (i.e. total points, point from source A,
    B, C...)

  - You implemented tiebreaking (using aux score field) and updated tiebreaker description in meta-data

  - Some of our client-side typing is a little iffy (use of "any", etc.).

  - The client-side input code does not support cancellation yet.  (Do we ever actually need this?)

- Future improvements

  - Server/client improvement: remember which seat(s) have seen which face-down card(s), and show those cards to the
    player in a "third state" ("face-down but you know what this is")?

- Things to mention in docs

  - Included content: at the designer/publisher's request, Kickstarter-exclusive content (Rings, Dragons) is not
    available.
