export const buildOptions = <TWith extends (opts: TOpts) => TOpts | Partial<TOpts>, TOpts extends object>(
  defaultValue: TOpts, opts: TWith[]
): TOpts => {
  let buildedOpts: TOpts = defaultValue;
  for (const opt of opts) {
    if (!opt) continue;
    buildedOpts = { ...buildedOpts, ...opt(buildedOpts) };
  }

  return buildedOpts;
};
