/**
 * Visual Mode Type Definition
 *
 * Shared between main process and renderer for type-safe IPC communication.
 *
 * @mode default - User-controlled interaction (mouse/touch creates fluid effects)
 * @mode auto - Automated random fluid movements (no user input response)
 * @mode blackmirror - Static black screen (no effects, no input response)
 */
export type VisualMode = 'default' | 'auto' | 'blackmirror'
