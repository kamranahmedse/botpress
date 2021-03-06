import { Button, Classes, Dialog, FormGroup, InputGroup, TextArea } from '@blueprintjs/core'
import { Workspace } from 'common/typings'
import React, { FC, useEffect, useState } from 'react'
import api from '~/api'
import { toastFailure, toastSuccess } from '~/utils/toaster'

interface Props {
  workspace: Workspace
  isOpen: boolean
  toggle: () => void
  refreshWorkspaces: () => void
}

const EditWorkspaceModal: FC<Props> = props => {
  const [name, setName] = useState()
  const [description, setDescription] = useState()

  useEffect(() => {
    if (props.workspace) {
      const { name, description } = props.workspace

      setName(name)
      setDescription(description)
    }
  }, [props.workspace, props.isOpen])

  const submit = async () => {
    try {
      await api.getSecured().post(`/admin/workspaces/${props.workspace.id}`, { name, description })
      props.refreshWorkspaces()

      toastSuccess(`Workspace saved successfully`)
      closeModal()
    } catch (err) {
      toastFailure(err.message)
    }
  }

  const closeModal = () => {
    setName('')
    setDescription('')
    props.toggle()
  }

  return (
    <Dialog isOpen={props.isOpen} icon="edit" onClose={closeModal} transitionDuration={0} title={'Edit Workspace'}>
      <div className={Classes.DIALOG_BODY}>
        <FormGroup label={<span>Workspace Name</span>} labelFor="input-name" labelInfo="*">
          <InputGroup
            id="input-name"
            placeholder="The name of your workspace"
            value={name}
            onChange={e => setName(e.currentTarget.value)}
            tabIndex={1}
            autoFocus={true}
          />
        </FormGroup>

        <FormGroup label={<span>Description</span>} labelFor="input-description">
          <TextArea
            id="input-description"
            placeholder="What is this workspace being used for? (optional)"
            value={description}
            onChange={e => setDescription(e.currentTarget.value)}
            rows={3}
            fill={true}
            tabIndex={2}
            maxLength={500}
          />
        </FormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button id="btn-submit" text="Save" tabIndex={3} onClick={submit} />
        </div>
      </div>
    </Dialog>
  )
}

export default EditWorkspaceModal
