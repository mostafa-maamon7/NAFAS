/**
 * Legacy clinical audio facade — ZERO synthesized oscillators or beeps.
 * Delegates exclusively to real recorded buffers in nafasAudio when unmuted.
 */

import { nafasAudio } from './nafasAudio';

class ClinicalAudioFacade {
  public muted: boolean = true;

  public playInspectPing() {
    if (this.muted) return;
    nafasAudio.playRingTick();
  }

  public playHeartbeatPulse() {
    if (this.muted) return;
    nafasAudio.playCueById('body_heartbeat_calm', 0.45);
  }

  public playThrustPulse() {
    if (this.muted) return;
    nafasAudio.playAbdominalThrust(1, false);
  }

  public playCorrectDecision() {
    if (this.muted) return;
    nafasAudio.playStarPing(0);
  }

  public playSuboptimalDecision() {
    if (this.muted) return;
    nafasAudio.playMistakeCue();
  }

  public playCriticalError() {
    if (this.muted) return;
    nafasAudio.playMistakeCue();
  }

  public playAirwayCleared() {
    if (this.muted) return;
    nafasAudio.playCueById('sfx_object_pop', 0.72);
  }

  public playSuccessChime() {
    if (this.muted) return;
    nafasAudio.playStarPing(0);
  }

  public playWarningBuzz() {
    if (this.muted) return;
    nafasAudio.playMistakeCue();
  }
}

export const clinicalAudio = new ClinicalAudioFacade();
