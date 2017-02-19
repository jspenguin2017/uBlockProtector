using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Script_Compiler
{
    public partial class FormMain : Form
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public FormMain()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Default git root directory
        /// </summary>
        private const string DefaultGitRoot = "D:\\Git\\AdBlockProtector";

        /// <summary>
        /// Form load event handler
        /// Set default git root
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FormMain_Load(object sender, EventArgs e)
        {
            TBGitRoot.Text = DefaultGitRoot;
        }

        /// <summary>
        /// Build release button click handler
        /// Compile the release build
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void BtnBuildRelease_Click(object sender, EventArgs e)
        {
            //Update UI
            string gitRoot = updateUI(true);
            //Start main process
            await Task.Run(() =>
            {
                //All we need to do in release build is to combine these 2 files together
                //Other libraries will be loaded via @require tags
                //Load everything into RAM
                string[] metadata;
                string[] rules;
                if (!loadFile(Path.Combine(gitRoot, "Script Compiler\\Metadata.js"), out metadata))
                {
                    return;
                }
                if (!loadFile(Path.Combine(gitRoot, "Script Compiler\\Rules.js"), out rules))
                {
                    return;
                }
                //Write to file
                string[] toWrite = metadata.Concat(rules).ToArray();
                try
                {
                    string path = Path.Combine(gitRoot, "AdBlockProtector.user.js");
                    putLog("Writting data to " + path);
                    File.WriteAllLines(path, toWrite);
                    putLog(toWrite.Length.ToString() + " lines wrote. ");
                }
                catch (Exception err)
                {
                    putLog("Cannot write file, error message: ");
                    putLog(err.Message);
                    return;
                }
            });
            //Unlock UI
            updateUI(false);
        }

        /// <summary>
        /// Build dev button click handler
        /// Compile the dev build
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void BtnBuildDev_Click(object sender, EventArgs e)
        {
            //Lock UI
            string gitRoot = updateUI(true);
            //Start main process
            await Task.Run(() =>
            {
                //We need to remove @require tags and then combines all 5 files together
                //Load everything into RAM
                string[] metadata;
                string[] jQuery;
                string[] color; //The jQuery plug-in
                string[] core;
                string[] rules;
                if (!loadFile(Path.Combine(gitRoot, "Script Compiler\\Metadata.js"), out metadata))
                {
                    return;
                }
                if (!loadFile(Path.Combine(gitRoot, "jQuery\\Core.Factory.3.1.1.min.js"), out jQuery))
                {
                    return;
                }
                if (!loadFile(Path.Combine(gitRoot, "jQuery\\Color.Loader.2.1.2.min.js"), out color))
                {
                    return;
                }
                if (!loadFile(Path.Combine(gitRoot, "Script Compiler\\Core.js"), out core))
                {
                    return;
                }
                if (!loadFile(Path.Combine(gitRoot, "Script Compiler\\Rules.js"), out rules))
                {
                    return;
                }
                //Patch metadata
                putLog("Patching metadata... ");
                List<string> newMetadata = new List<string>();
                int counter = 0;
                for (int i = 0; i < metadata.Length; i++)
                {
                    string t = metadata[i];
                    if (t.StartsWith("// @require"))
                    {
                        //Skip @require tags
                        counter++;
                    }
                    else
                    {
                        //Put into patched list
                        newMetadata.Add(t);
                    }
                }
                putLog(counter.ToString() + " @require tags removed. ");
                //Copy to clipboard
                string[] data = newMetadata.ToArray().Concat(jQuery).ToArray();
                data = data.Concat(color).ToArray();
                data = data.Concat(core).ToArray();
                data = data.Concat(rules).ToArray();
                try
                {
                    //We need a new STA thread to access clipboard
                    Thread thread = new Thread(() =>
                    {
                        Clipboard.SetText(string.Join(Environment.NewLine, data));
                    });
                    thread.SetApartmentState(ApartmentState.STA);
                    thread.Start();
                    //Wait for the tread to end
                    thread.Join();
                    putLog(data.Length.ToString() + " lines copied to clipboard. ");
                }
                catch (Exception err)
                {
                    putLog("Cannot copy to clipboard, error message: ");
                    putLog(err.Message);
                    return;
                }
            });
            //Unlock UI
            updateUI(false);
        }

        /// <summary>
        /// Lock or unlock UI, will return data in git root textbox
        /// </summary>
        /// <param name="locking">True to lock UI, false to unlock UI</param>
        /// <returns>Data in git root textbox</returns>
        private string updateUI(bool locking)
        {
            if (locking)
            {
                //Lock elements
                BtnBuildRelease.Enabled = false;
                BtnBuildDev.Enabled = false;
                TBGitRoot.Enabled = false;
            }
            else
            {
                //Unlock elements
                BtnBuildRelease.Enabled = true;
                BtnBuildDev.Enabled = true;
                TBGitRoot.Enabled = true;
            }
            //Return git root
            return TBGitRoot.Text;
        }

        /// <summary>
        /// Safely load a file
        /// </summary>
        /// <param name="filePath">The path to the file to read</param>
        /// <param name="data">The output variable</param>
        /// <returns>True if successful, false otherwise</returns>
        private bool loadFile(string filePath, out string[] data)
        {
            string[] dataRead;
            //Read file
            try
            {
                putLog("Reading data from " + filePath + "... ");
                dataRead = File.ReadAllLines(filePath);
                putLog(dataRead.Length.ToString() + " lines read. ");
                //Return result
                data = dataRead;
                return true;
            }
            catch (Exception err)
            {
                putLog("Cannot read file, error message: ");
                putLog(err.Message);
                data = new string[0];
                return false;
            }
        }

        /// <summary>
        /// Write log into log textbox, a new line will be automatically added
        /// This method can be called from another thread
        /// </summary>
        /// <param name="msg">The message to write</param>
        private void putLog(string msg)
        {
            if (TBLog.InvokeRequired)
            {
                Invoke((MethodInvoker)(() =>
                {
                    TBLog.Text += msg + Environment.NewLine;
                }));
            }
            else
            {
                TBLog.Text += msg + Environment.NewLine;
            }
        }
    }
}
