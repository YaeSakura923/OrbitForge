/* Copyright (C) 2025 orbitforge contributors */

import { PriorityListGroup } from "@orbitforge/orbitforge-utils";

import { type TextElement } from "./TextElement";

/**
 * Group of {@link TextElement} sharing same priority.
 */
export class TextElementGroup extends PriorityListGroup<TextElement> {}
