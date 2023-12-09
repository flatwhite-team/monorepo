export function sendSlackNotibotMessage(input: string) {
  return fetch(
    "https://hooks.slack.com/services/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",
    {
      method: "POST",
      body: JSON.stringify({
        text: input,
      }),
    },
  );
}
