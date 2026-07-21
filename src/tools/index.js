import { lazy } from 'react';

export const CompressTool = lazy(() => import('./CompressTool'));
export const MergeTool = lazy(() => import('./MergeTool'));
export const SignTool = lazy(() => import('./SignTool'));
export const PdfToJpgTool = lazy(() => import('./PdfToJpgTool'));
export const JpgToPdfTool = lazy(() => import('./JpgToPdfTool'));
export const HtmlToPdfTool = lazy(() => import('./HtmlToPdfTool'));
export const SplitTool = lazy(() => import('./SplitTool'));
export const RotateTool = lazy(() => import('./RotateTool'));
export const DeletePagesTool = lazy(() => import('./DeletePagesTool'));
export const RearrangeTool = lazy(() => import('./RearrangeTool'));
export const WatermarkTool = lazy(() => import('./WatermarkTool'));
export const ProtectTool = lazy(() => import('./ProtectTool'));
export const UnlockTool = lazy(() => import('./UnlockTool'));
export const MockTool = lazy(() => import('./MockTool'));
