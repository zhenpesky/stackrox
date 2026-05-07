import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TextInput,
    Tooltip,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import {
    AngleDownIcon,
    AngleUpIcon,
    EyeIcon,
    EyeSlashIcon,
    GripVerticalIcon,
    PencilAltIcon,
    TrashIcon,
} from '@patternfly/react-icons';

export type ManageSavedFilterRow = {
    id: string;
    name: string;
    hidden?: boolean;
};

export type ManageSavedFiltersModalV1Props = {
    isOpen: boolean;
    onClose: () => void;
    items: ManageSavedFilterRow[];
    /** Persists reorder, renames, visibility, and removals (matches 5173 manage flow). */
    onSave: (next: ManageSavedFilterRow[]) => void;
};

/**
 * Ported from localhost:5173 `UserWorkloadVulnerabilities.jsx` → `ManageSavedFiltersModal`.
 */
export default function ManageSavedFiltersModalV1({
    isOpen,
    onClose,
    items,
    onSave,
}: ManageSavedFiltersModalV1Props): ReactElement {
    const [localItems, setLocalItems] = useState<ManageSavedFilterRow[]>(items);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLocalItems(items);
        }
    }, [isOpen, items]);

    const move = (index: number, dir: number) => {
        const next = [...localItems];
        const j = index + dir;
        if (j < 0 || j >= next.length) {
            return;
        }
        [next[index], next[j]] = [next[j], next[index]];
        setLocalItems(next);
    };

    return (
        <Modal variant="medium" isOpen={isOpen} onClose={onClose}>
            <ModalHeader
                title="Manage saved filters"
                description="Hide, edit, or delete saved filters. You can also change the order of items shown in your saved filters menu."
            />
            <ModalBody>
                <Table aria-label="Manage saved filters" variant="compact">
                    <Thead>
                        <Tr>
                            <Th screenReaderText="Reorder" />
                            <Th>Name</Th>
                            <Th screenReaderText="Visibility" />
                            <Th screenReaderText="Edit" />
                            <Th screenReaderText="Delete" />
                        </Tr>
                    </Thead>
                    <Tbody>
                        {localItems.map((row, index) => (
                            <Tr key={row.id}>
                                <Td>
                                    <Flex
                                        gap={{ default: 'gapSm' }}
                                        alignItems={{ default: 'alignItemsCenter' }}
                                    >
                                        <GripVerticalIcon
                                            aria-hidden
                                            style={{
                                                color: 'var(--pf-t--global--icon--color--subtle)',
                                            }}
                                        />
                                        <Button
                                            variant="plain"
                                            aria-label="Move up"
                                            isDisabled={index === 0}
                                            onClick={() => move(index, -1)}
                                            icon={<AngleUpIcon />}
                                        />
                                        <Button
                                            variant="plain"
                                            aria-label="Move down"
                                            isDisabled={index === localItems.length - 1}
                                            onClick={() => move(index, 1)}
                                            icon={<AngleDownIcon />}
                                        />
                                    </Flex>
                                </Td>
                                <Td>
                                    {editingId === row.id ? (
                                        <TextInput
                                            value={editName}
                                            onChange={(_e, v) => setEditName(v)}
                                            aria-label="Filter name"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const name = editName.trim() || row.name;
                                                    setLocalItems((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id ? { ...r, name } : r
                                                        )
                                                    );
                                                    setEditingId(null);
                                                }
                                            }}
                                        />
                                    ) : (
                                        row.name
                                    )}
                                </Td>
                                <Td>
                                    <Tooltip
                                        content={
                                            row.hidden
                                                ? 'Show in saved filters menu'
                                                : 'Hide from saved filters menu'
                                        }
                                    >
                                        <Button
                                            variant="plain"
                                            aria-label={
                                                row.hidden ? 'Show in menu' : 'Hide from menu'
                                            }
                                            icon={row.hidden ? <EyeSlashIcon /> : <EyeIcon />}
                                            onClick={() => {
                                                const next = localItems.map((r) =>
                                                    r.id === row.id
                                                        ? { ...r, hidden: !r.hidden }
                                                        : r
                                                );
                                                setLocalItems(next);
                                            }}
                                        />
                                    </Tooltip>
                                </Td>
                                <Td>
                                    <Tooltip content="Edit filter name">
                                        <Button
                                            variant="plain"
                                            aria-label="Edit filter name"
                                            icon={<PencilAltIcon />}
                                            onClick={() => {
                                                setEditingId(row.id);
                                                setEditName(row.name);
                                            }}
                                        />
                                    </Tooltip>
                                </Td>
                                <Td>
                                    <Button
                                        variant="plain"
                                        aria-label="Delete"
                                        icon={<TrashIcon />}
                                        onClick={() => {
                                            const next = localItems.filter((r) => r.id !== row.id);
                                            setLocalItems(next);
                                        }}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="primary"
                    onClick={() => {
                        onSave(localItems);
                        onClose();
                    }}
                >
                    Save
                </Button>
                <Button variant="link" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
}
