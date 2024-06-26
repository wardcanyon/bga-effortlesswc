/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * EffortlessWC implementation : © Kevin Kelley <kelleyk@kelleyk.net>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
/// <amd-module name="bgagame/effortlesswc"/>

// import Gamegui = require('ebg/core/gamegui');
// import 'ebg/counter';

/** The root for all of your game code. */
class GameBody extends GameBasics {
  // myGlobalValue: number = 0;
  // myGlobalArray: string[] = [];

  protected mutableBoardState: MutableBoardState | undefined = undefined;

  protected tablewidePanelEl: HTMLElement | undefined = undefined;

  /** @gameSpecific See {@link Gamegui} for more information. */
  constructor() {
    super();
    console.log('effortlesswc constructor');
  }

  /** @gameSpecific See {@link Gamegui.setup} for more information. */
  public setup(gamedatas: Gamedatas): void {
    console.log('Starting game setup');

    // Setting up player boards
    for (const playerId in gamedatas.players) {
      if (gamedatas.players.hasOwnProperty(playerId)) {
        const player = gamedatas.players[playerId];
        // TODO: Setting up players boards if needed
        console.log(player);
      }
    }

    // TODO: Set up your game interface here, according to "gamedatas"

    this.setupSeatBoards(gamedatas.mutableBoardState);

    this.setupPlayArea(gamedatas.mutableBoardState);

    // Setup game notifications to handle (see "setupNotifications" method below)
    this.setupNotifications();

    console.log('Ending game setup');
  }

  // This overrides a default implementation that BGA provides.
  public updatePlayerOrdering(): void {
    console.log('*** updatePlayerOrdering()');

    // N.B.: We start at 1 instead of at 0, like the default implementation does, so that our table-wide panel stays at
    // the top.  We should eventually improve this so that it handles seat boards as well.
    let place = 1;

    for (const i of Object.keys(this.gamedatas.playerorder)) {
      const playerId = this.gamedatas.playerorder[i];
      dojo.place('overall_player_board_' + playerId, 'player_boards', place);
      place++;
    }
  }

  public setupSeatBoards(mutableBoardState: MutableBoardState): void {
    console.log(
      'setupSeatBoards(): #player_boards =',
      $('player_boards').children.length,
    );

    this.tablewidePanelEl = dojo.place(
      this.format_block('jstpl_tablewide_panel', {}),
      $('player_boards'),
      'first',
    );

    console.log(
      'setupSeatBoards(): after tablewide panel creation, player_boards =',
      $('player_boards').children,
    );

    for (const seat of Object.values(mutableBoardState.seats)) {
      if (seat.playerId === null) {
        dojo.place(
          this.format_block('jstpl_seat_board', {
            seatColor: seat.seatColor,
            seatId: seat.id,
            seatLabel: 'Bot A', // seat.seatLabel, XXX:
          }),
          $('player_boards'),
        );
      }
    }
  }

  public setupPlayArea(mutableBoardState: MutableBoardState) {
    // Create the element that will display each setting-location pair and associated cards.
    for (let i = 0; i < 6; ++i) {
      dojo.place(
        this.format_block('jstpl_setloc_panel', {
          classes: '',
          id: 'ewc_setloc_panel_' + i,
        }),
        $('ewc_setlocarea_column_' + (i % 2))!,
      );
    }

    // Create a counter for the amount of effort that each seat has on each location.
    for (const seat of Object.values(mutableBoardState.seats)) {
      for (let i = 0; i < 6; ++i) {
        const parentEl = document.querySelector(
          '#ewc_setloc_panel_' + i + ' .ewc_effort_counter_wrap',
        );

        dojo.place(
          this.format_block('jstpl_effort_counter', {
            colorName: seat.colorName,
            locationIndex: i,
            seatId: seat.id,
          }),
          parentEl,
        );
      }
    }

    this.applyMutableBoardState(mutableBoardState);
  }

  public applyMutableBoardState(mutableBoardState: MutableBoardState) {
    this.mutableBoardState = mutableBoardState;

    // XXX: This will probably need a little bit of work when we start supporting changes to and discarding of settings
    // and locations.

    for (const location of Object.values(mutableBoardState.locations)) {
      console.log('*** location', location);

      // XXX: We need the bang ("!") here because, if the card is not visible, we won't know its type.  These particular
      // cards are always visible, however.  Should we consider improving our types so that we have visible and
      // not-visible subtypes?
      document
        .querySelector(
          '#ewc_setloc_panel_' +
            location.sublocationIndex +
            ' .ewc_setloc_location',
        )!
        .classList.add(location.cardType!.replace(':', '_'));

      for (const [seatId, effortQty] of Object.entries(location.effort)) {
        document.querySelector<HTMLElement>(
          '#ewc_effort_counter_' +
            location.sublocationIndex +
            '_' +
            seatId +
            ' .ewc_effort_counter_value',
        )!.innerText = '' + effortQty;
      }
    }

    for (const setting of Object.values(mutableBoardState.settings)) {
      // console.log('*** setting', setting);

      // XXX: See above comment about "!".
      document
        .querySelector(
          '#ewc_setloc_panel_' +
            setting.sublocationIndex +
            ' .ewc_setloc_setting',
        )!
        .classList.add(setting.cardType!.replace(':', '_'));
    }

    for (const card of Object.values(mutableBoardState.cards)) {
      console.log('*** card', card);

      const cardType = card.faceDown ? 'back' : card.cardType;

      const parentEl = document.querySelector(
        '#ewc_setloc_panel_' + card.sublocationIndex + ' .ewc_setloc_cards',
      )!;
      console.log('*** parentEl', parentEl);

      dojo.place(
        this.format_block('jstpl_playarea_card', {
          cardType,
          id: card.id,
        }),
        parentEl,
      );
    }

    // This function assumes that the matched element has a parent wrapper element.
    console.log('*** qsa ***');
    document
      .querySelectorAll('.tmp_scalable_card')
      .forEach((rawEl: Element) => {
        const el = rawEl as HTMLElement;

        // Don't rescale on multiple calls.  We may not need this if we're always rescaling from "source dimensions".
        if (el.classList.contains('tmp_scaled_card')) {
          return;
        }
        el.classList.add('tmp_scaled_card');

        const scaleFactor = 0.5;
        this.rescaleSprite(el, scaleFactor);
      });

    document
      .querySelectorAll('.tmp_scalable_cube')
      .forEach((rawEl: Element) => {
        const el = rawEl as HTMLElement;

        // Don't rescale on multiple calls.  We may not need this if we're always rescaling from "source dimensions".
        if (el.classList.contains('tmp_scaled_cube')) {
          return;
        }
        el.classList.add('tmp_scale_cube');

        this.rescaleSpriteCube(el, 0.6);
      });

    document.querySelectorAll('.tmp_tintable').forEach((rawEl: Element) => {
      const el = rawEl as HTMLElement;

      // Don't rescale on multiple calls.  We may not need this if we're always rescaling from "source dimensions".
      if (el.classList.contains('tmp_tinted')) {
        return;
      }
      el.classList.add('tmp_tinted');

      // XXX: We have several versions of this color translation code between the client and server sides of the game.
      // We should find a better way to consolidate.
      if (el.classList.contains('ewc_playercolor_teal')) {
        this.tintSprite(el, '#00b796');
      }
      if (el.classList.contains('ewc_playercolor_pink')) {
        this.tintSprite(el, '#ff5fa2');
      }
      if (el.classList.contains('ewc_playercolor_blue')) {
        this.tintSprite(el, '#001489');
      }
      if (el.classList.contains('ewc_playercolor_yellow')) {
        this.tintSprite(el, '#ffe900');
      }
      if (el.classList.contains('ewc_playercolor_white')) {
        this.tintSprite(el, '#ffffff');
      }
    });
  }

  // XXX: The need for this is a bit unfortunate; we could eliminate it.
  public getSpriteName(el: HTMLElement): string {
    // console.log('*** getSpriteName()', el.classList);

    for (const className of Object.values(el.classList)) {
      console.log(className);
      if (className.match(/^card_/g)) {
        return className;
      }
    }
    throw new Error('XXX: Unable to find sprite name.');
  }

  public rescaleSprite(el: HTMLElement, scale: number) {
    const spriteName = this.getSpriteName(el);
    const spriteMetadata = StaticDataSprites.spriteMetadata[spriteName];

    // console.log('rescaleSprite for spriteName=', spriteName);

    // XXX: We should pull these numbers from static card data.

    el.style.height = spriteMetadata.height * scale + 'px';
    el.style.width = spriteMetadata.width * scale + 'px';

    const bgSize =
      StaticDataSprites.totalWidth * scale +
      'px ' +
      StaticDataSprites.totalHeight * scale +
      'px';
    // console.log('*** bgSize = ', bgSize);
    el.style.backgroundSize = bgSize;

    el.style.backgroundPosition =
      spriteMetadata.offsetX * scale +
      'px ' +
      spriteMetadata.offsetY * scale +
      'px';
  }

  public rescaleSpriteCube(el: HTMLElement, scale: number) {
    // console.log('** rescaleSpriteCube()', el, scale);

    el.style.height = 30.0 * scale + 'px';
    el.style.width = 30.0 * scale + 'px';
    const spritesheetSize = 312.0 * scale + 'px ' + 302.4 * scale + 'px';
    // console.log('*** bgSize = ', spritesheetSize);
    el.style.backgroundSize = spritesheetSize;
    el.style.maskSize = spritesheetSize;
    const spritesheetPos = -276.0 * scale + 'px ' + -121.2 * scale + 'px';
    el.style.backgroundPosition = spritesheetPos;
    el.style.maskPosition = spritesheetPos;
  }

  public tintSprite(el: HTMLElement, color: string) {
    el.style.backgroundBlendMode = 'multiply';
    el.style.backgroundColor = color;
  }

  ///////////////////////////////////////////////////
  //// Game & client states

  /** @gameSpecific See {@link Gamegui.onEnteringState} for more information. */
  public onEnteringState(stateName: string, args: any): void {
    console.log('Entering state', stateName, args);

    switch (stateName) {
      case 'dummmy':
        break;
    }
  }

  /** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
  public onLeavingState(stateName: string): void {
    console.log('Leaving state: ' + stateName);

    switch (stateName) {
      case 'dummmy':
        break;
    }
  }

  /** @gameSpecific See {@link Gamegui.onUpdateActionButtons} for more information. */
  public onUpdateActionButtons(stateName: string, args: any | null): void {
    console.log('onUpdateActionButtons: ' + stateName, args);

    if (!this.isCurrentPlayerActive()) {
      return;
    }

    switch (stateName) {
      case 'dummmy':
        // Add buttons if needed
        break;
    }
  }

  ///////////////////////////////////////////////////
  //// Utility methods

  /*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/

  ///////////////////////////////////////////////////
  //// Player's action

  /*
		Here, you are defining methods to handle player's action (ex: results of mouse click on game objects).

		Most of the time, these methods:
		- check the action is possible at this game state.
		- make a call to the game server
	*/

  /*
	Example:
	onMyMethodToCall1( evt: Event )
	{
		console.log( 'onMyMethodToCall1' );

		// Preventing default browser reaction
		evt.preventDefault();

		//	With base Gamegui class...

		// Check that this action is possible (see "possibleactions" in states.inc.php)
		if(!this.checkAction( 'myAction' ))
			return;

		this.ajaxcall( "/yourgamename/yourgamename/myAction.html", {
			lock: true,
			myArgument1: arg1,
			myArgument2: arg2,
		}, this, function( result ) {
			// What to do after the server call if it succeeded
			// (most of the time: nothing)
		}, function( is_error) {

			// What to do after the server call in anyway (success or failure)
			// (most of the time: nothing)
		} );


		//	With GameguiCookbook::Common...
		this.ajaxAction( 'myAction', { myArgument1: arg1, myArgument2: arg2 }, (is_error) => {} );
	}
	*/

  ///////////////////////////////////////////////////
  //// Reaction to cometD notifications

  /** @gameSpecific See {@link Gamegui.setupNotifications} for more information. */
  public setupNotifications() {
    console.log('notifications subscriptions setup');

    // TODO: here, associate your game notifications with local methods

    // With base Gamegui class...
    // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

    // With GameguiCookbook::Common class...
    // this.subscribeNotif( 'cardPlayed', this.notif_cardPlayed ); // Adds type safety to the subscription
  }

  /*
	Example:

	// The argument here should be one of there things:
	// - `Notif`: A notification with all possible arguments defined by the NotifTypes interface. See {@link Notif}.
	// - `NotifFrom<'cardPlayed'>`: A notification matching any other notification with the same arguments as 'cardPlayed'
	//   (A type can be used here instead). See {@link NotifFrom}.
	// - `NotifAs<'cardPlayed'>`: A notification that is explicitly a 'cardPlayed' Notif. See {@link NotifAs}.
	notif_cardPlayed( notif: NotifFrom<'cardPlayed'> )
	{
		console.log( 'notif_cardPlayed', notif );
		// Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
	}
	*/
}

// // The global 'bgagame.effortlesswc' class is instantiated when the page is loaded. The following code sets this
// // variable to your game class.
// dojo.setObject('bgagame.effortlesswc', EffortlessWC);
// Same as: (window.bgagame ??= {}).effortlesswc = EffortlessWC;
