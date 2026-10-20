import { Resend } from "resend";

// Resolve credentials only when sending, so importing routes during a build
// does not require mail access. Keep the SDK response contract for callers.
export const resend = {
  emails: {
    async send(
      ...args: Parameters<Resend["emails"]["send"]>
    ): ReturnType<Resend["emails"]["send"]> {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        return {
          data: null,
          error: {
            name: "missing_api_key",
            message: "E-mailverzending is niet geconfigureerd.",
            statusCode: null,
          },
          headers: null,
        };
      }

      return new Resend(apiKey).emails.send(...args);
    },
  },
};
