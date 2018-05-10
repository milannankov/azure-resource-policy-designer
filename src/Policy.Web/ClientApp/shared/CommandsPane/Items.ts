interface CommandItemBase {
    id: string;
    caption: string;
    iconCssClasses: string;
}

export interface ExecutableCommandItem extends CommandItemBase {
    shortcut: string;
}

export interface CommandGroupItem extends CommandItemBase {
    items?: Array<CommandItemBase>;
}

export type CommandItem = ExecutableCommandItem | CommandGroupItem;

export function isExecutable(item: CommandItem): item is ExecutableCommandItem {
    return (<ExecutableCommandItem>item).shortcut !== undefined;
}

export function isGroup(item: CommandItem): item is CommandGroupItem {
    return (<CommandGroupItem>item).items !== undefined;
}