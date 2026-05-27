# @between-reads/canon

Shared Thema-based literary vocabulary used by `agent-match` (and eventually `agent-list`).

## Layout

```
canon/
├── yaml/              # source-of-truth YAML files
│   ├── aliases.yaml
│   ├── extensions.yaml
│   ├── hard_nos.yaml
│   ├── thema_subjects.yaml
│   ├── thema_audience.yaml
│   ├── thema_form.yaml
│   └── VERSION
├── python/            # betweenreads_canon Python package
└── ts/                # @between-reads/canon TypeScript package
```

The YAMLs are the single source of truth. Both loaders resolve them by relative path
from the package source — this only works because the loaders are always installed
editable via uv / pnpm workspace.

## Usage

Python:
```python
from betweenreads_canon import CANON_DIR, load, version
aliases = load("aliases")
```

TypeScript:
```ts
import { CANON_DIR, load, version } from "@between-reads/canon";
const aliases = load("aliases");
```
