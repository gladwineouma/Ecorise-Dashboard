import React from "react";
import { RiSettings3Fill, RiHammerFill, RiToolsFill } from "react-icons/ri";
import "./style.css";

function Settings() {
    return (
        <div className="feedback-main-container">
            {/* Ambient background dust particles */}
            <div className="particle-dust pd-1"></div>
            <div className="particle-dust pd-2"></div>
            <div className="particle-dust pd-3"></div>
            <div className="particle-dust pd-4"></div>

            <div className="feedback-table-container settings-coming-soon-wrapper high-motion-scene">

                {/* MULTI-LAYERED KINETIC LAB BOX */}
                <div className="kinetic-animation-box">

                    {/* Background structural pulse radar */}
                    <div className="radar-wave rw-1"></div>
                    <div className="radar-wave rw-2"></div>

                    {/* Secondary micro gear */}
                    <div className="micro-gear-box">
                        <RiSettings3Fill className="spinning-micro-gear" />
                    </div>

                    {/* Main engine capsule */}
                    <div className="gear-pulse-circle cinematic-glow">
                        <RiSettings3Fill className="spinning-gear-icon extreme-spin" />
                        <RiToolsFill className="inner-floating-wrench" />
                    </div>

                    {/* Elastic heavy construction hammer */}
                    <div className="hammer-arm-pivot">
                        <RiHammerFill className="swinging-hammer-icon mechanical-slam" />
                    </div>

                    {/* Sparks/impact base marker */}
                    <div className="anvil-impact-point"></div>
                </div>

                {/* TYPOGRAPHY WITH ENERGETIC GLITCH WAVE EFFECT */}
                <h1 className="coming-soon-title elastic-text">
                    <span>S</span><span>e</span><span>t</span><span>t</span><span>i</span><span>n</span><span>g</span><span>s</span>
                </h1>

                <p className="coming-soon-subtitle marquee-fade-in">
                    Engineering workspace upgrades. This console module is currently undergoing system compilation.
                </p>

                {/* SONIC PROGRESS TRAILER BLOCK */}
                <div className="progress-bar-track neon-border">
                    <div className="progress-bar-fill-loading hypersonic-pulse">
                        <div className="light-beam-sweep"></div>
                    </div>
                </div>

                {/* BOUNCING INDUSTRIAL WARNING BADGE */}
                <div className="construction-tag-badge">
                    <span className="stripe-pattern"></span>
                    <span className="badge-text-alert">UNDER CONSTRUCTION</span>
                    <span className="stripe-pattern"></span>
                </div>

            </div>
        </div>
    );
}

export default Settings;
