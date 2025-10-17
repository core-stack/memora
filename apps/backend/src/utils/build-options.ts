export const buildOptions = <TWith extends Function, TOpts extends object>(defaultValue: TOpts, opts: TWith[]): TOpts => {
    let buildedOpts: TOpts = defaultValue;
    for (const opt of opts) {
      if (!opt) continue;
      buildedOpts = { ...buildedOpts, ...opt(buildedOpts) };
    }

    return buildedOpts;
  }