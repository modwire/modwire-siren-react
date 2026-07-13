import ArrowBack from "@mui/icons-material/ArrowBack";
import Bolt from "@mui/icons-material/Bolt";
import CheckBox from "@mui/icons-material/CheckBox";
import Close from "@mui/icons-material/Close";
import Folder from "@mui/icons-material/Folder";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Link from "@mui/icons-material/Link";
import Menu from "@mui/icons-material/Menu";
import MoreVert from "@mui/icons-material/MoreVert";
import RadioButtonChecked from "@mui/icons-material/RadioButtonChecked";
import Search from "@mui/icons-material/Search";

import { IconReference } from "../../domain/interactions/icon-reference";
import { StandardIconName } from "../../domain/vocabulary/icon-name";
import { IconRegistryBuilder } from "./builder";
import { ElementIconFactory } from "./element";
import type { LocalIconRegistry } from "./registry";
import { SilentRendererObserver } from "../../adapters/silent-renderer";

export class StandardIconRegistry {
  create(): LocalIconRegistry {
    const builder = new IconRegistryBuilder();
    builder
      .register(
        new IconReference(StandardIconName.menu),
        new ElementIconFactory(<Menu aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.search),
        new ElementIconFactory(<Search aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.more),
        new ElementIconFactory(<MoreVert aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.back),
        new ElementIconFactory(<ArrowBack aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.close),
        new ElementIconFactory(<Close aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.command),
        new ElementIconFactory(<Bolt aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.destination),
        new ElementIconFactory(<Link aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.toggle),
        new ElementIconFactory(<CheckBox aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.choice),
        new ElementIconFactory(<RadioButtonChecked aria-hidden />),
      )
      .register(
        new IconReference(StandardIconName.group),
        new ElementIconFactory(<Folder aria-hidden />),
      );
    return builder.build(
      new ElementIconFactory(<HelpOutline aria-hidden />),
      new SilentRendererObserver(),
    );
  }
}
