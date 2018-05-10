import { ExecutableCommandItem, CommandGroupItem, CommandItem } from '../../shared/CommandsPane/Items';
import * as core from '../core';

const CommandAddLogicalAbove: ExecutableCommandItem = {
    id: "add-logical-above",
    caption: "Above",
    iconCssClasses: "fal fa-level-up",
    shortcut: "",
}

const CommandAddLogicalBelow: ExecutableCommandItem = {
    id: "add-logical-below",
    caption: "Below",
    iconCssClasses: "fal fa-level-down",
    shortcut: "",
}

const CommandAddLogicalChildTop: ExecutableCommandItem = {
    id: "add-logical-child-top",
    caption: "Child Top",
    iconCssClasses: "fal fa-arrow-alt-from-top",
    shortcut: "",
}

const CommandAddLogicalChildBottom: ExecutableCommandItem = {
    id: "add-logical-child-bottom",
    caption: "Child Bottom",
    iconCssClasses: "fal fa-arrow-alt-from-bottom",
    shortcut: "",
}

const CommandAddConditionAbove: ExecutableCommandItem = {
    id: "add-condition-above",
    caption: "Above",
    iconCssClasses: "fal fa-level-up",
    shortcut: "",
}

const CommandAddConditionBelow: ExecutableCommandItem = {
    id: "add-condition-below",
    caption: "Below",
    iconCssClasses: "fal fa-level-down",
    shortcut: "",
}

const CommandAddConditionChildTop: ExecutableCommandItem = {
    id: "add-condition-child-top",
    caption: "Child Top",
    iconCssClasses: "fal fa-arrow-alt-from-top",
    shortcut: "",
}

const CommandAddConditionChildBottom: ExecutableCommandItem = {
    id: "add-condition-child-bottom",
    caption: "Child Bottom",
    iconCssClasses: "fal fa-arrow-alt-from-bottom",
    shortcut: "",
}

const CommandPasteAbove: ExecutableCommandItem = {
    id: "paste-above",
    caption: "Above",
    iconCssClasses: "fal fa-level-up",
    shortcut: "",
}

const CommandPasteBelow: ExecutableCommandItem = {
    id: "paste-below",
    caption: "Below",
    iconCssClasses: "fal fa-level-down",
    shortcut: "",
}

const CommandPasteChildTop: ExecutableCommandItem = {
    id: "paste-child-top",
    caption: "Child Top",
    iconCssClasses: "fal fa-arrow-alt-from-top",
    shortcut: "",
}

const CommandPasteChildBottom: ExecutableCommandItem = {
    id: "paste-child-bottom",
    caption: "Child Bottom",
    iconCssClasses: "fal fa-arrow-alt-from-bottom",
    shortcut: "",
}

const CommandCut: ExecutableCommandItem = {
    id: "cut",
    caption: "Cut",
    iconCssClasses: "fal fa-cut",
    shortcut: "",
}

const CommandCopy: ExecutableCommandItem = {
    id: "copy",
    caption: "Copy",
    iconCssClasses: "fal fa-copy",
    shortcut: "",
}

const CommandDelete: ExecutableCommandItem = {
    id: "delete",
    caption: "Delete",
    iconCssClasses: "fal fa-trash-alt",
    shortcut: "",
}

const CommandEdit: ExecutableCommandItem = {
    id: "edit",
    caption: "Edit",
    iconCssClasses: "fal fa-edit",
    shortcut: "",
}

export function getCommandsForNode(node: core.PolicyRuleNode, canPaste: boolean): Array<CommandItem> {

    if (node == null) {
        return [];
    }

    if (core.isLogical(node) && node.logicalType === "if") {
        return getCommandsForIf(node, canPaste);
    }

    if (core.isLogical(node)) {
        return getCommandsForLogical(node, canPaste);
    }

    if (core.isCondition(node)) {
        return getCommandsForCondition(node, canPaste);
    }

    throw new Error("Unknown node type");
}

function getCommandsForLogical(node: core.PolicyRuleLogicalNode, canPaste: boolean): Array<CommandItem> {

    let addCommands = [
        {
            id: "add-condition",
            caption: "Add Condition",
            iconCssClasses: "fal fa-file-alt",
            items: [
                ...node.parent.acceptsAdditionalChildren() ? [CommandAddConditionAbove, CommandAddConditionBelow] : [], 
                ...node.acceptsAdditionalChildren() ? [CommandAddConditionChildTop, CommandAddConditionChildBottom] : []
            ]
        },
        {
            id: "add-logical",
            caption: "Add Logical",
            iconCssClasses: "fal fa-sitemap",
            items: [
                ...node.parent.acceptsAdditionalChildren() ? [CommandAddLogicalAbove, CommandAddLogicalBelow] : [], 
                ...node.acceptsAdditionalChildren() ? [CommandAddLogicalChildTop, CommandAddLogicalChildBottom] : []
            ]
        },
        {
            id: "paste",
            caption: "Paste",
            iconCssClasses: "fal fa-paste",
            items: [
                ...node.parent.acceptsAdditionalChildren() && canPaste ? [CommandPasteAbove, CommandPasteBelow] : [], 
                ...node.acceptsAdditionalChildren() && canPaste ? [CommandPasteChildTop, CommandPasteChildBottom] : []
            ]
        }
    ];

    let commands = []

    addCommands.forEach(c => {
        if(c.items.length > 0) {
            commands.push(c);
        }
    })

    //TODO: add condition for delete
    commands.push(CommandCopy);
    commands.push(CommandCut);
    commands.push(CommandDelete);

    return commands;
}

function getCommandsForIf(node: core.PolicyRuleLogicalNode, canPaste: boolean): Array<CommandItem> {

    let addCommands = node.children.length > 0 ? [] : [
        {
            id: "add-condition",
            caption: "Add Condition",
            iconCssClasses: "fal fa-file-alt",
            items: [CommandAddConditionChildTop, CommandAddConditionChildBottom]
        },
        {
            id: "add-logical",
            caption: "Add Logical",
            iconCssClasses: "fal fa-sitemap",
            items: [CommandAddLogicalChildTop, CommandAddLogicalChildBottom]
        },
        {
            id: "paste",
            caption: "Paste",
            iconCssClasses: "fal fa-paste",
            items: [CommandPasteChildTop, CommandPasteChildBottom]
        }
    ];

    if (addCommands.length > 0 && !canPaste) {
        addCommands.splice(2, 1);
    }

    let commands = []
    commands.push(...addCommands);

    return commands;
}

function getCommandsForCondition(node: core.PolicyRuleConditionNode, canPaste: boolean): Array<CommandItem> {
    let addCommands = !node.parent.acceptsAdditionalChildren() ? [] : [
        {
            id: "add-condition",
            caption: "Add Condition",
            iconCssClasses: "fal fa-file-alt",
            items: [CommandAddConditionAbove, CommandAddConditionBelow]
        },
        {
            id: "add-logical",
            caption: "Add Logical",
            iconCssClasses: "fal fa-sitemap",
            items: [CommandAddLogicalAbove, CommandAddLogicalBelow]
        },
        {
            id: "paste",
            caption: "Paste",
            iconCssClasses: "fal fa-paste",
            items: [CommandPasteAbove, CommandPasteBelow]
        }
    ];

    let commands = []

    if (addCommands.length > 0 && !canPaste) {
        addCommands.splice(2, 1);
    }

    commands.push(...addCommands);
    commands.push(CommandEdit);
    commands.push(CommandCopy);
    commands.push(CommandCut);
    commands.push(CommandDelete);

    return commands;
}