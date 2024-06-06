<?php declare(strict_types=1);

// XXX: We need a way to do sorting that lets the Fighter attribute do its tiebreaking thing.

abstract class Setting
{
  // Concrete subclasses must define:
  // - SETTING_ID
  // - SET_ID
  // - OUTCOME_GOOD

  public function effortBySeat(World $world)
  {
    throw new \feException('no impl');
  }

  // XXX: make abstract
  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    throw new \feException('XXX: needs to be implemented on each thing');
  }

  // Returns an array containing the IDs of the seat(s) that will be affected by this setting at scoring time.  This is
  // used to highlight certain seats' effort counts in the UI.
  public function affectedSeats(World $world)
  {
    throw new \feException('XXX: needs to be implemented on each thing');
  }

  public function rankByEffort(World $world, bool $invert = false)
  {
    // XXX: read $outcome_good from class
    return $world->rankByEffort($world->effortBySeat($this), $outcome_good, $invert);
  }

  // Like `rankByEffort()` but returns a list of the seat IDs at rank 1.
  public function topByEffort(World $world, bool $invert = false)
  {
    // XXX: read $outcome_good from class
    return $world->topByEffort($world->effortBySeat($this), $outcome_good, $invert);
  }

  // Returns a list of seat IDs that have at least $n effort here.
  public function seatsWithEffort(World $world, int $n)
  {
    $seats = [];
    foreach ($this->effortBySeat($world) as $seatId => $effort) {
      if ($effort >= $n) {
        $seats[] = $seatId;
      }
    }
    return $seats;
  }
}

// >=1 effort -> 3 pt
class ActiveSetting extends Setting
{
  const SETTING_ID = 'setting:active';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = true;

  public function affectedSeats(World $world)
  {
    return $this->seatsWithEffort($world, 1);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->affectedSeats($world) as $seatId) {
      $score_ctx->givePoints($seatId, 3);
    }
  }
}

class BarrenSetting extends Setting
{
  const SETTING_ID = 'setting:barren';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = true;

  public function affectedSeats(World $world)
  {
    return [];
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    // No effects.
  }
}

// most effort -> 8 pt
class BattlingSetting extends Setting
{
  const SETTING_ID = 'setting:battling';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = true;

  public function affectedSeats(World $world)
  {
    return $this->topByEffort($world);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->affectedSeats($world) as $seatId) {
      $score_ctx->givePoints($seatId, 8);
    }
  }
}

// -1 point per effort.
class TreacherousSetting extends Setting
{
  const SETTING_ID = 'setting:treacherous';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = false;

  public function affectedSeats(World $world)
  {
    return $this->seatsWithEffort($world, 1);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->effortBySeat($world) as $seatId => $effort) {
      $score_ctx->givePoints($seatId, -1 * $effort);
    }
  }
}

// Each player with 5 or more effort gets 10 points.
class CrowdedSetting extends Setting
{
  const SETTING_ID = 'setting:crowded';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = true;

  public function affectedSeats(World $world)
  {
    return $this->seatsWithEffort($world, 5);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->affectedSeats($world) as $seatId) {
      $score_ctx->givePoints($seatId, 10);
    }
  }
}

// Least effort => 3 points.
class EerieSetting extends Setting
{
  const SETTING_ID = 'setting:eerie';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = true;

  public function affectedSeats(World $world)
  {
    return $this->topByEffort($world, /*invert=*/ true);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->affectedSeats($world) as $seatId) {
      $score_ctx->givePoints($seatId, 3);
    }
  }
}

// XXX: (?) The person with the most effort here gets -1 point for each 2 total effort here.
class GhostlySetting extends Setting
{
  const SETTING_ID = 'setting:ghostly';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = false;

  public function affectedSeats(World $world)
  {
    return $this->topByEffort($world);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->affectedSeats($world) as $seatId) {
      $score_ctx->givePoints($seatId, -1 * intdiv($this->totalEffort($world), 2));
    }
  }
}

// Least effort => -5 points.
class HiddenSetting extends Setting
{
  const SETTING_ID = 'setting:hidden';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = false;

  public function affectedSeats(World $world)
  {
    return $this->topByEffort($world, /*invert=*/ true);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->affectedSeats($world) as $seatId) {
      $score_ctx->givePoints($seatId, -5);
    }
  }
}

// Most effort => 1 point for every 2 total effort here.
class HolySetting extends Setting
{
  const SETTING_ID = 'setting:holy';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = true;

  public function affectedSeats(World $world)
  {
    return $this->topByEffort($world);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->affectedSeats($world) as $seatId) {
      $score_ctx->givePoints($seatId, intdiv($this->totalEffort($world), 2));
    }
  }
}

// 1 point per effort.
class LivelySetting extends Setting
{
  const SETTING_ID = 'setting:lively';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = true;

  public function affectedSeats(World $world)
  {
    return $this->seatsWithEffort($world, 1);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->effortBySeat($world) as $seatId => $effort) {
      $score_ctx->givePoints($seatId, $effort);
    }
  }
}

// 3 points for every 2 effort.
class PeacefulSetting extends Setting
{
  const SETTING_ID = 'setting:peaceful';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = true;

  public function affectedSeats(World $world)
  {
    return $this->seatsWithEffort($world, 2);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->effortBySeat($world) as $seatId => $effort) {
      $score_ctx->givePoints($seatId, 3 * intdiv($effort, 2));
    }
  }
}

// Most effort => -3 points.
class QuietSetting extends Setting
{
  const SETTING_ID = 'setting:quiet';
  const SET_ID = SET_BASE;

  const OUTCOME_GOOD = false;

  public function affectedSeats(World $world)
  {
    return $this->topByEffort($world);
  }

  public function onScoring(World $world, ScoringContext $score_ctx): void
  {
    foreach ($this->affectedSeats($world) as $seatId) {
      $score_ctx->givePoints($seatId, -3);
    }
  }
}

// "When scoring attributes, the player with the most Effort here gains +2 to all attributes."
//
// DESIGNER: This only applies during the attribute scoring phase; the other attribute-related things in the scoring
// phase care about number of attribute cards, anyhow.
class TranscendentSetting extends Setting
{
  const SETTING_ID = 'setting:transcendent';
  const SET_ID = SET_ALTERED;

  public function onScoringAttributes(World $world): void
  {
    // XXX: getParameter ...
  }
}

// "When scoring Items, gain 1 experience for every 3 effort you have here."
class EquippedSetting extends Setting
{
  const SETTING_ID = 'setting:equipped';
  const SET_ID = SET_ALTERED;
}

// "When scoring attributes, gain +1 to all attributes for every 4 effort you have here."
class MagicalSetting extends Setting
{
  const SETTING_ID = 'setting:magical';
  const SET_ID = SET_ALTERED;
}

// "When scoring armor, gain 1 wild armor piece for every 3 effort you have here.  (You cannot score more than 13 points
// for one set of armor.)"
class ShelteredSetting extends Setting
{
  const SETTING_ID = 'setting:sheltered';
  const SET_ID = SET_ALTERED;
}

// "At the end of the game, before scoring, draw 1 card from the top of the deck for every 3 effort you have here."
class SecretSetting extends Setting
{
  const SETTING_ID = 'setting:secret';
  const SET_ID = SET_ALTERED;
}

// "Threats defeated at this Location score double Greatness."
class StarvedSetting extends Setting
{
  const SETTING_ID = 'setting:starved';
  const SET_ID = SET_HUNTED;
}

// "Threats are dealt facedown at this Location.  Reveal the threat when fighting."
//
// XXX: complication
class OvergrownSetting extends Setting
{
  const SETTING_ID = 'setting:overgrown';
  const SET_ID = SET_HUNTED;
}

// "At the end of the game, before Scoring Locations, players may move effort from here to any other locations (in
// reverse turn order)."
//
// XXX: complication -- pre-scoring user input
class TravelingSetting extends Setting
{
  const SETTING_ID = 'setting:traveling';
  const SET_ID = SET_HUNTED;

  public function onPreScoring(World $world): void
  {
    // XXX: getParameter ...
  }
}

// "When fighting a Threat, gain +1 Grit for every 3 Effort you have here."
//
// XXX: complication
class CapableSetting extends Setting
{
  const SETTING_ID = 'setting:capable';
  const SET_ID = SET_HUNTED;
}

// "When fighting a Threat at this Location, players may only use 2 of the Threat's Weaknesses to deal damage.
// (Critical Weaknesses still do 3 damage.)"
//
// XXX: complication
//
// DESIGNER: "Lost" was removed from the expansion in favor of "Corrupted".
class CorruptedSetting extends Setting
{
  const SETTING_ID = 'setting:corrupted';
  const SET_ID = SET_HUNTED;
}