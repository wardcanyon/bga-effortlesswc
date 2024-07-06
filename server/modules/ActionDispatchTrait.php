<?php declare(strict_types=1);

namespace EffortlessWC;

/**
  @phan-file-suppress PhanUndeclaredStaticMethod

  XXX: TODO: We can remove this once we move states to classes that implement an interface rather than traits.
*/

trait ActionDispatchTrait
{
  use \EffortlessWC\BaseTableTrait;

  // -----------
  // Action handler dispatchers
  // -----------

  // XXX: These could probably be automatically generated by walking
  // the state traits and looking at which action handlers they
  // define.

  function onActSelectInput($selection): void
  {
    $this->checkAction('actSelectInput');

    $stateName = $this->gamestate->state()['name'];
    switch ($stateName) {
      case 'stInput':
        self::onActSelectInput_stInput($selection);
        return;
      default:
        throw new \BgaUserException('Unexpected state for `actSelectInput`: ' . $stateName);
    }
  }
}
