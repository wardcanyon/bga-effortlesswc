<?php declare(strict_types=1);

namespace EffortlessWC\Models;

use EffortlessWC\Models\Location;
use EffortlessWC\Models\Seat;

class EffortPile
{
  public function seat(): Seat
  {
    throw new \feException('XXX:');
  }

  // Returns null iff this is a reserve effort pile (and thus not associated with a location).
  public function location(): ?Location
  {
    throw new \feException('XXX:');
  }

  // Returns the number of effort cubes in this pile.
  public function qty(): int
  {
    throw new \feException('XXX:');
  }
}
