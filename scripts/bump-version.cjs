const fs =
  require('fs');

const path =
  require('path');

const root =
  path.resolve(
    __dirname,
    '..'
  );

const packagePath =
  path.join(
    root,
    'package.json'
  );

const pkg =
  JSON.parse(
    fs.readFileSync(
      packagePath,
      'utf8'
    )
  );

const current =
  String(
    pkg.version ||
    '1.0.0'
  );

const parts =
  current
    .split('.')
    .map(
      value =>
        Number(
          value
        ) || 0
    );

while (
  parts.length < 3
) {
  parts.push(0);
}

parts[2] += 1;

const next =
  `${parts[0]}.${parts[1]}.${parts[2]}`;

pkg.version =
  next;

fs.writeFileSync(
  packagePath,
  JSON.stringify(
    pkg,
    null,
    2
  ) + '\n',
  'utf8'
);

const lockPath =
  path.join(
    root,
    'package-lock.json'
  );

if (
  fs.existsSync(
    lockPath
  )
) {
  try {
    const lock =
      JSON.parse(
        fs.readFileSync(
          lockPath,
          'utf8'
        )
      );

    lock.version =
      next;

    if (
      lock.packages &&
      lock.packages['']
    ) {
      lock.packages[''].version =
        next;
    }

    fs.writeFileSync(
      lockPath,
      JSON.stringify(
        lock,
        null,
        2
      ) + '\n',
      'utf8'
    );
  } catch {
    // package-lock update is best-effort only.
  }
}

console.log(
  `Version: ${current} -> ${next}`
);
