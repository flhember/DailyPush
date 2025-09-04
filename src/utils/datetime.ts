type Opts = {
  locale?: string;
  withTime?: boolean;
};

export function formatInDeviceTZ(input?: string | Date | null, opts: Opts = {}) {
  if (!input) return '';
  const locale = opts.locale ?? Intl.DateTimeFormat().resolvedOptions().locale;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '';

  const options: Intl.DateTimeFormatOptions =
    opts.withTime !== false
      ? { dateStyle: 'medium', timeStyle: 'short', timeZone }
      : { dateStyle: 'medium', timeZone };

  return new Intl.DateTimeFormat(locale, options).format(date);
}
