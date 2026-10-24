# Campus Virtual UNQ - Centro de Estudiantes DAO

DApp descentralizada de gobernanza estudiantil para la **Universidad Nacional de Quilmes (UNQ)**, inspirada en la estética institucional del Campus Virtual (`https://campus.uvq.edu.ar`).

Desarrollada **100% en TypeScript** en una arquitectura frontend-only moderna con **React + Vite + Tailwind CSS**, usando un **ORM cliente tipado** con persistencia local reactiva (sin necesidad de servidores backend separados ni dependencias nativas).

---

## 🏛️ Contratos Desplegados en Sepolia Testnet

| Contrato | Dirección | Descripción |
|---|---|---|
| **`StudentCredential` (CRED)** | `0x7141982F41b288bBF3fA7927360f9b4FB2FC18eE` | Credencial NFT Soulbound (ERC-721 + ERC721Votes). 1 Alumno = 1 Voto. Emisión controlada por la Facultad (`ISSUER_ROLE`). |
| **`StudentGovernor`** | `0x94a6A38E968110b7aE9477413d89baa540834A65` | Gobernador OpenZeppelin v5 (Voting delay: 60s, Voting period: 300s, Cooldown: 60s, Quórum: 10%). |
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

## 📦 Estructura del Código (TypeScript Puro)

```
unq-campus-dao/
├── src/
│   ├── config/
│   │   └── contracts.ts         # Direcciones de Sepolia y ABIs tipados
│   ├── db/
│   │   ├── schema.ts            # Esquemas de datos (StudentRecord, ProposalRecord)
│   │   └── index.ts             # ORM local tipado con persistencia
│   ├── services/
│   │   ├── web3.ts              # Ethers v6, conexión MetaMask y Governor
│   │   └── api.ts               # Capa de servicio conectada al ORM
│   ├── components/
│   │   ├── Navbar.tsx           # Header institucional UNQ (#7a1827) con Switcher de Rol
│   │   ├── Sidebar.tsx          # Accesos Rápidos estilo Campus UNQ
│   │   ├── RightSidebar.tsx     # Banners oficiales UNQ (Biblioteca, UNQtv, Streaming)
│   │   ├── ProposalCard.tsx     # Tarjeta de propuesta con barras de quórum y votos
│   │   ├── StudentBadge.tsx     # Credencial universitaria NFT interactiva
│   │   └── VoteModal.tsx        # Modal de votación on-chain (A favor, En contra, Abstención)
│   ├── views/
│   │   ├── ProposalsView.tsx         # Pestañas "Todas las propuestas" y "Mis propuestas"
│   │   ├── ProposalDetailView.tsx    # Expediente completo, Queue y Execute en Timelock
│   │   ├── CreateProposalView.tsx    # Formulario con validación de cooldown y Tesorería
│   │   ├── StudentRegistrationView.tsx # Solicitud de ingreso con DNI, Carrera y Foto
│   │   └── AdminPanelView.tsx        # Bandeja para Aprobar y Mintear NFTs on-chain
│   ├── types/index.ts           # Modelos de TypeScript (Proposal, Wallet, Role, etc.)
│   ├── App.tsx                  # Orquestador principal
│   └── main.tsx
├── tailwind.config.js           # Paleta de colores UNQ (#7a1827)
├── tsconfig.json                # Configuración TypeScript estricta
└── vite.config.ts
```

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
