<?php declare(strict_types=1);

namespace Effortless;

use Effortless\World;

trait RenderTrait
{
  // XXX: Move to better home
  public function renderForClient(World $world, $x)
  {
    if (is_array($x)) {
      return array_map(function ($y) use ($world) {
        return $this->renderForClient($world, $y);
      }, $x);
    }

    $result = $x->renderForClient($world);
    // XXX: If enabled, validate $result against schema.
    return $result;
  }
}
