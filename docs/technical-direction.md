# Technical Direction

## Engine Plan

Final production target: Unreal Engine 5 with OpenXR.

The current Three.js prototype exists to validate:

- lighting language
- first-person pacing
- flashlight/fear readability
- document inspection
- corridor scale
- high-end UI treatment

## UE5 Architecture

- `BP_PlayerController_VR`
- `BP_PlayerController_Flatscreen`
- shared `BP_PlayerCharacter`
- interaction component
- physical inventory component
- fear and sanity component
- quest/objective component
- AI director
- save component
- audio manager

## Rendering Tiers

- `VR_HighFidelity`: Lumen, Nanite, high shadow resolution, PCVR and PSVR2.
- `VR_Mobile`: baked lighting, manual LODs, mobile forward renderer, Quest standalone.

## VR UX Rules

- No permanent floating health bars.
- Notes and objectives should be readable objects.
- Flashlight battery should be shown on the prop itself in production.
- Camera motion must never be forced for scares.
- Comfort settings are a ship requirement, not a bonus.
