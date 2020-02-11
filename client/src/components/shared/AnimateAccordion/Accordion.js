import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Headings } from '../../../utils/theme'
import './Accordion.css'

export const Accordion = ({ i, expanded, setExpanded, ...props }) => {
    const isOpen = i === expanded;
    const { setStatus, name } = props;
    return (
        <>
            <motion.header
                initial={false}
                animate={{ backgroundColor: isOpen ? "#ff9900" : "#232f3e" }}
                onClick={() => setExpanded(isOpen ? false : i)}
            >
                <div className="accordion__title">
                    <h4 style={{ margin: 0 }}>{name}</h4>
                    <div>
                        <Button
                            name="info_base"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation()
                                setStatus(e, name, "base")
                            }}>
                            Szczegóły
                            </Button>
                        <Button
                            name="edit_base"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation()
                                setStatus(e, name, "base")
                            }}>
                            Edytuj
                            </Button>
                        <Button
                            name="drop_base"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation()
                                // dropUserBase()
                                setStatus(e, name, "base")
                            }}>
                            Usuń
                            </Button>
                    </div>
                </div>


            </motion.header>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        {props.children}
                    </motion.section>
                )}
            </AnimatePresence>
        </>
    );
};

export const Example = () => {
    // This approach is if you only want max one section open at a time. If you want multiple
    // sections to potentially be open simultaneously, they can all be given their own `useState`.
    const [expanded, setExpanded] = useState(false);

    return accordionIds.map(i => (
        <Accordion i={i} expanded={expanded} setExpanded={setExpanded} >
            <div>ww</div>
        </Accordion>
    ));
};

const accordionIds = [0, 1, 2, 3];
