// These handles are technically numbers, but functions like 'createLink' should only accept Host instances.
declare interface Handle<T>
{
	/** (This property does not exist on the handle and merely serves to make the handle types incompatible.) */
	type: T;
}
declare interface Host extends Handle<"Host"> { }
declare interface Link extends Handle<"Link"> { }
declare interface ExaFile extends Handle<"File"> { }
declare interface Register extends Handle<"Register"> { }
declare interface Goal extends Handle<"Goal"> { }
declare interface ExaWindow extends Handle<"ExaWindow"> { }

declare type ExaFileEntry = string | number;
declare type ExaFileContents = ExaFileEntry[];

declare const FILE_ICON_DATA: 0;
declare const FILE_ICON_TEXT: 1;
declare const FILE_ICON_USER: 2;
declare const FILE_ICON_ARCHIVE: 3;
declare const FILE_ICON_FOLDER: 4;
declare const FILE_ICON_SECURE: 5;
declare const FILE_ICON_MOVIE: 6;
declare const FILE_ICON_MUSIC: 7;
declare type Icon = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * A value that can be used to create a one-way link with `createLink`.
 */
declare const LINK_ID_NONE: -10000;

/**
 * Create a host in the network with the specified name, position, and size. The X coordinate increases toward the top-right corner of the screen, while the Y coordinate increases toward the top-left corner of the screen.
 * 
 * Returns a host handle that can be passed to other API functions.
 */
declare function createHost(name: string, x: number, y: number, width: number, height: number): Host;


/**
 * Create a link between the specified hosts using the specified link IDs. The two hosts must visibly align so that a link could be created, and must be spaced with exactly two grid units between them.
 * 
 * Instead of a numeric value, you may use the constant `LINK_ID_NONE` to create a one-way or impassable link.
 * 
 * Returns a link handle that can be passed to other API functions.
 * @example
 * // Create two hosts and a link connecting them.
 * var inboxHost = createHost("inbox", 5, 0, 3, 3);
 * var outboxHost = createHost("outbox", 10, 0, 3, 3);
 * createLink(inboxHost, 800, outboxHost, -1);
 */
declare function createLink(firstHostHandle: Host, firstID: number, secondHostHandle: Host, secondID: number): Link;

/*
 * Change the link IDs of the specified link to the specified values.
 */
declare function modifyLink(linkHandle: Link, firstID: number, secondID: Link): void;

/**
 * 
 * Create a normal, movable file in the specified host with the specified ID, icon, and contents. The file's contents should be an array of integers and strings, which correspond to number and keyword values respectively.
 * 
 * The allowed values for `icon` are `FILE_ICON_DATA`, `FILE_ICON_TEXT`, `FILE_ICON_USER`, `FILE_ICON_ARCHIVE`, `FILE_ICON_FOLDER`, `FILE_ICON_SECURE`, `FILE_ICON_MOVIE`, and `FILE_ICON_MUSIC`.
 * 
 * Returns a file handle that can be passed to other API functions.
 */
declare function createNormalFile(hostHandle: Host, id: number, icon: Icon, contents: ExaFileContents): ExaFile;

/**
 * Similar to `createNormalFile`, except that the created file cannot be moved out of its initial host. A file ID can only be used more than once in a network if all files with that ID are locked.
 *
 * Returns a file handle that can be passed to other API functions.
 */
declare function createLockedFile(hostHandle: Host, id: number, icon: Icon, contents: ExaFileContents): ExaFile;

/**
 * Enable column mode for the specified file's display window, which will automatically wrap the file contents after the specified number of values.
 */
declare function setFileColumnCount(fileHandle: ExaFile, columnCount: number): void;

/**
 * Set the specified file's display window to be initially collapsed when connecting to the network or switching to a different test run.
 * 
 * @example
 * 
 * // Create a normal file in the player host with two values (a keyword and a number) and set it to be initially collapsed.
 * var playerFile = createNormalFile(getPlayerHost(), 300, "data", ["ABC", 123]);
 * setFileInitiallyCollapsed(playerFile);
 */
declare function setFileInitiallyCollapsed(fileHandle: ExaFile): void;

/**
 * Create a hardware register in the specified host with the specified position and name. A hardware register's name must consist of exactly four alphanumeric characters.
 *
 * Returns a hardware register handle that can be passed to other API functions.
 */
declare function createRegister(hostHandle: Host, x: number, y: number, name: string): Register;

/**
 * Set the specified function as the read callback for the specified hardware register. When an EXA attempts to read from the register the read callback will be called and whatever value it returns will be read by the EXA. A read callback should return either an integer or a string.
 * 
 * @example
 * 
 * // Create a hardware register that can store a single value.
 * var targetHost = createHost("target", 5, 0, 3, 3);
 * var registerHandle = createRegister(targetHost, 7, 2, "TEST");
 * var registerValue = 0;
 * 
 * setRegisterReadCallback(registerHandle, function() {
 *     return registerValue;
 * });
 * 
 * setRegisterWriteCallback(registerHandle, function(value) {
 *     registerValue = value;
 * });
 */
declare function setRegisterReadCallback(registerHandle: Register, readCallback: () => ExaFileEntry): void;


/**
 * Set the specified function as the write callback for the specified hardware register. When an EXA attempts to write to the register the write callback will be called and whatever value it wrote will be passed to the callback as either an integer or a string.
 * 
 * @example
 * 
 * // Create a hardware register that can store a single value.
 * var targetHost = createHost("target", 5, 0, 3, 3);
 * var registerHandle = createRegister(targetHost, 7, 2, "TEST");
 * var registerValue = 0;
 * 
 * setRegisterReadCallback(registerHandle, function() {
 *     return registerValue;
 * });
 * 
 * setRegisterWriteCallback(registerHandle, function(value) {
 *     registerValue = value;
 * });
 */
declare function setRegisterWriteCallback(registerHandle: Register, writeCallback: (value: ExaFileEntry) => void): void;

/**
 * Create a goal that requires a file with the specified contents to be created in the specified host. To require a file to be brought back to the player's host, use the result of `getPlayerHost` for the `hostHandle` argument.
 */
declare function requireCreateFile(hostHandle: Host, contents: ExaFileContents, description: string): void;


/**
 * Create a goal that requires the specified file to be moved to the specified host.
 */
declare function requireMoveFile(fileHandle: ExaFile, hostHandle: Host, description: string): void;

/**
 * Create a goal that requires the specified file to be changed to have the specified contents.
 */
declare function requireChangeFile(fileHandle: ExaFile, contents: ExaFileContents, description: string): void;

/**
 * Create a goal that requires the specified file to be moved to the specified host and changed to have the specified contents.
 */
declare function requireMoveAndChangeFile(fileHandle: ExaFile, hostHandle: Host, contents: ExaFileContents, description: string): void;

/**
 * Create a goal that requires the specified file to be deleted from the network.
 */
declare function requireDeleteFile(fileHandle: ExaFile, description: string): void;

/**
 * Create a custom goal that can be marked as completed or failed from a hardware register callback.
 *
 * Returns a custom goal handle that can be passed to other API functions.
 *
 * @example
 *
 * // Create a register and goal requiring it to be written to.
 * var targetHost = createHost("target", 5, 0, 3, 3);
 * var registerHandle = createRegister(targetHost, 7, 2, "TEST");
 * var goalHandle = requireCustomGoal("Write any value to the #TEST register.");
 *
 * setRegisterWriteCallback(registerHandle, function(value) {
 *     setCustomGoalCompleted(goalHandle);
 * });
 */
declare function requireCustomGoal(description: string): Goal;

/**
 * Mark the specified custom goal as completed.
 *
 * @example
 *
 * // Create a register and goal requiring it to be written to.
 * var targetHost = createHost("target", 5, 0, 3, 3);
 * var registerHandle = createRegister(targetHost, 7, 2, "TEST");
 * var goalHandle = requireCustomGoal("Write any value to the #TEST register.");
 *
 * setRegisterWriteCallback(registerHandle, function(value) {
 *     setCustomGoalCompleted(goalHandle);
 * });
 */
declare function setCustomGoalCompleted(goalHandle: Goal): void;

/**
 * Mark the specified custom goal as failed.
 */
declare function setCustomGoalFailed(goalHandle: Goal): void;

/**
 * Merge the `requirementCount` most recently created requirements into a single requirement. Merged requirements will display the progress of their sub-requirements as a fraction (such as "4/6").
 *
 * @example
 *
 * // Create four files and a goal requiring them to be deleted.
 * var targetHost = createHost("target", 5, 0, 3, 3);
 * for (var i = 0; i < 4; i++) {
 *     var fileHandle = createNormalFile(targetHost, 200 + i, "data", [i]);
 *     requireDeleteFile(fileHandle, "");
 * }
 *
 * mergeRequirements(4, "Delete all files in the *target* host.");
 */
declare function mergeRequirements(requirementCount: number, description: string): void;


/**
 * Create an input / output table with the specified title and position, in addition to a goal with the specified description that requires all output columns in the table to be completed correctly.
 *
 * A network may only contain a single input/output table.
 * 
 * @example
 * 
 * // Create an input / output table and associated goal requiring the input values to be doubled and written to the output register.
 * var inputValues = [];
 * var outputValues = [];
 * for (var i = 0; i < 30; i++) {
 *     inputValues[i] = randomInt(1000, 5000);
 *     outputValues[i] = inputValues[i] * 2;
 * }
 *
 * var targetHost = createHost("target", 5, 0, 3, 3);
 * createTable("I/O LOG", 108, 0, "Transfer the specified values.");
 * addTableInput("INPUT", inputValues, createRegister(targetHost, 7, 2, "INPT"));
 * addTableOutput("OUTPUT", outputValues, createRegister(targetHost, 7, 0, "OUTP"));
 */
declare function createTable(title: string, x: number, y: number, description: string): void;

/**
 * Add an input column to the input / output table with the specified label and input values. When an EXA reads from the specified register, it will read the next input value from this column.
 */
declare function addTableInput(label: string, values: ExaFileContents, registerHandle: Register): void;

/**
 * Add an output column to the input / output table with the specified label and expected values. When an EXA writes to the specified register, it will append the output value to this column and compare it to the corresponding expected value.
 */
declare function addTableOutput(label: string, values: ExaFileContents, registerHandle: Register): void;

/**
 * Create an output window with the specified title, position, and size. Output windows can display arbitrary text, and are typically used to provide additional feedback in networks utilizing hardware registers.
 *
 * Returns an output window handle that can be passed to other API functions.
 */
declare function createWindow(title: string, x: number, y: number, width: number, height: number): ExaWindow;

/**
 * Print the specified line of text to the specified window. Lines that are longer than the window is wide will be automatically truncated.
 */
declare function printWindow(windowHandle: ExaWindow, text: string): void;

/**
 * Clear the contents of the specified window.
 */
declare function clearWindow(windowHandle: ExaWindow): void;

/**
 * Returns a random number between `min` and `max`, inclusive.
 */
declare function randomInt(min: number, max: number): number;

/**
 * Returns a boolean that is `true` with the specified probability, where a value of `0` will always return `false` and a value of `1` will always return `true`.
 */
declare function randomBool(probability: Number): boolean;

/**
 * Returns a random value from the specified array.
 */
declare function randomChoice<T>(choices: T[]): T;

/**
 * Returns a random name.
 */
declare function randomName(): string;

/**
 * Returns a random residential address.
 */
declare function randomAddress(): string;

/**
 * Returns a host handle for the player's host, which is created automatically and cannot be altered.
 */
declare function getPlayerHost(): Host;

/**
 * Returns an array of keywords generated by splitting the specified multiword string on spaces (which are omitted) and punctuation (which are included). Useful for creating the contents of text-based files.
 */
declare function convertTextToKeywords(text: string): string[];

/**
 * Open the in-network debug console and print the textual representation of the specified object to it.
 *
 * The debug console is only intended for debugging scripts and displaying errors. If you want to display information about the network you should use output windows instead of the debug console.
 */
declare function printConsole(object: any): void;
