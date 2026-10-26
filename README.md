# Campus Virtual UNQ - Centro de Estudiantes DAO

DApp descentralizada de gobernanza estudiantil para la **Universidad Nacional de Quilmes (UNQ)**, inspirada en la estética institucional del Campus Virtual (`https://campus.uvq.edu.ar`).

Desarrollada **100% en TypeScript** en una arquitectura frontend-only moderna con **React + Vite + Tailwind CSS**, usando un **ORM cliente tipado** con persistencia local reactiva (sin necesidad de servidores backend separados ni dependencias nativas).

---

## 🏛️ Contratos Desplegados en Sepolia Testnet

| Contrato | Dirección | Descripción |
|---|---|---|
| **`StudentCredential` (CRED)** | `0x7141982F41b288bBF3fA7927360f9b4FB2FC18eE` | Credencial NFT Soulbound (ERC-721 + ERC721Votes). 1 Alumno = 1 Voto. Emisión controlada por la Facultad (`ISSUER_ROLE`). |
| **`StudentGovernor`** | `0x7Cc01Fd04C973Dc98975985cCBF12Dbc7B88be14` | Gobernador OpenZeppelin v5 con duración de votación por propuesta (Voting delay: 60s, Cooldown: 60s, Quórum: 10%). |
| **`TimelockController`** | `0x577C93ee3dEd72AA281A827Eea9cF145b1BB8003` | Delay de 60 segundos antes de ejecutar propuestas aprobadas. Owner de la Tesorería. |
| **`Treasury`** | `0xA458D22338fC4Ad907Fb098B51B2FCcE61773392` | Custodia de fondos en ETH para iniciativas estudiantiles. Tope máx: 20% por operación. |

---

## 🚀 Cómo Iniciar la Aplicación

Simplemente ejecutá:

```bash
cd /home/maxi/Documents/unq-campus-dao
npm run dev
```

Luego abrí en tu navegador:
👉 **`http://localhost:5173`**

---

## 📦 Estructura del Código

Stack: React 18 + Vite + Tailwind 3 + [Base UI](https://base-ui.com) (primitivas headless) + React Router + ethers v6 + Dexie.

```
src/
├── app/            App, Providers (contextos) y rutas (router.tsx)
├── layout/         AppShell, Navbar, Footer
├── components/
│   ├── ui/         Componentes base reutilizables (Button, Card, Dialog, Tabs, Select, Field,
│   │               Switch, Toast, Badge, Alert, Avatar, VoteBar...) sobre Base UI + cva
│   └── ...         PageHeader, BackLink, EmptyState, ExternalLink
├── features/
│   ├── wallet/     WalletContext (MetaMask) y LoginView
│   ├── proposals/  ProposalsContext, lista, detalle, creación, VoteModal, StatusBadge
│   ├── students/   StudentContext, registro, credencial NFT
│   ├── admin/      Panel de la Facultad (solicitudes, propuestas, tesorería)
│   └── treasury/   useTreasury
├── services/       Casos de uso on-chain (blockchain, proposals, students, treasury) y capa de datos
├── db/             Esquema y ORM local (Dexie)
├── config/         Direcciones y ABIs de los contratos
├── lib/            cn, format, errors, ethereum (utilidades)
└── types/
```

### Sistema de diseño
Las reglas de estilo (un solo radio, color con intención, sin decoración, una columna) están en [DESIGN.md](DESIGN.md). Los tokens viven en [tailwind.config.js](tailwind.config.js).

---

## ✨ Flujo de Uso

1. **Ingreso con MetaMask**:
   - Conectás tu wallet. Si no estás en Sepolia, un botón te ofrece cambiar de red al instante.
2. **Alternar de Rol (Admin / Estudiante)**:
   - Con el selector en la esquina superior derecha podés alternar entre el **"Modo Estudiante"** y el **"Modo Facultad (Admin)"** para probar ambas perspectivas con tu misma cuenta.
3. **Solicitud de Credencial**:
   - Si no poseés el NFT, ingresás a *"Solicitar Ingreso / Credencial"* con DNI, Nombre, Apellido, Carrera y Foto.
4. **Aprobación y Minteo On-Chain**:
   - Pasás al *"Panel Facultad"* y hacés clic en *"Aprobar y Mintear NFT"*. MetaMask abrirá la transacción para llamar a `StudentCredential.mint(address)` y emitir la credencial en Sepolia.
5. **Gobernanza Completa**:
   - Ya con tu credencial, podés crear propuestas (incluso solicitando fondos a la `Treasury`), votar on-chain con 1 estudiante = 1 voto, y una vez aprobada, encolar y ejecutar la propuesta a través del `TimelockController`.
