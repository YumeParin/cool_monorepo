export function formatAutoGappedLogMessage(userId: string): string {
  return `<@${userId}> has joined the server, but they were gapped because their account is too new.`;
}
