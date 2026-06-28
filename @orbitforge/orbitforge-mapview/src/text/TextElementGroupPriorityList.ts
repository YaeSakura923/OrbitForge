/* Copyright (C) 2025 orbitforge contributors */

import { GroupedPriorityList } from "@orbitforge/orbitforge-utils";

import { type TextElement } from "./TextElement";

/**
 * List of {@link TextElement} groups sorted by priority.
 */
export class TextElementGroupPriorityList extends GroupedPriorityList<TextElement> {}
