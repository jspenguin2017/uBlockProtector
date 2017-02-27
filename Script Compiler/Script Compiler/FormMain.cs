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
                //Build file
                string[] toWrite = build(gitRoot);
                //Check if build failed
                if (toWrite.Length == 0)
                {
                    return;
                }
                //Write file
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
                //Build file
                string[] data = build(gitRoot);
                //Check if build failed
                if (data.Length == 0)
                {
                    return;
                }
                //Copy to clipboard
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
        /// Build the script and returns it
        /// </summary>
        /// <param name="gitRoot">The git root</param>
        /// <returns>The build result, an empty array if failed</returns>
        private string[] build(string gitRoot)
        {
            //Load everything into RAM
            string[] metadata;
            string[] jQuery;
            string[] color; //The jQuery Color plug-in
            string[] core;
            string[] rules;
            if (!loadFile(Path.Combine(gitRoot, "Script Compiler\\Metadata.js"), false, out metadata))
            {
                return new string[0];
            }
            if (!loadFile(Path.Combine(gitRoot, "jQuery\\Core.Factory.3.1.1.min.js"), false, out jQuery))
            {
                return new string[0];
            }
            if (!loadFile(Path.Combine(gitRoot, "jQuery\\Color.Loader.2.1.2.min.js"), false, out color))
            {
                return new string[0];
            }
            if (!loadFile(Path.Combine(gitRoot, "Script Compiler\\Core.js"), true, out core))
            {
                return new string[0];
            }
            if (!loadFile(Path.Combine(gitRoot, "Script Compiler\\Rules.js"), true, out rules))
            {
                return new string[0];
            }
            //Put everything together
            string[] data = metadata.ToArray().Concat(jQuery).ToArray();
            //Uncomment the following line to enable the Color plug-in
            //data = data.Concat(color).ToArray();
            putLog("jQuery Color plug-in is not enabled. ");
            data = data.Concat(core).ToArray();
            data = data.Concat(rules).ToArray();
            return data;
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
        /// <param name="rmComments">Whether comments should be removed</param>
        /// <param name="data">The output variable</param>
        /// <returns>True if successful, false otherwise</returns>
        private bool loadFile(string filePath, bool rmComments, out string[] data)
        {
            string[] dataRead;
            //Read file
            try
            {
                putLog("Reading data from " + filePath + "... ");
                dataRead = File.ReadAllLines(filePath);
                putLog(dataRead.Length.ToString() + " lines read. ");
                if (rmComments)
                {
                    //Remove comments
                    List<string> dataOut = new List<string>();
                    bool commentBlockFlag = false;
                    for (int i = 0; i < dataRead.Length; i++)
                    {
                        string line = dataRead[i].Trim();
                        //Skip comments
                        //This algorithm wouldn't work for any JS file, but for ours, it will work
                        if (line.StartsWith("//") && !line.StartsWith("//Based on") && !line.StartsWith("//License") || line == string.Empty)
                        {
                            continue;
                        }
                        if (line.StartsWith("/*"))
                        {
                            commentBlockFlag = true;
                        }
                        if (line.EndsWith("*/"))
                        {
                            commentBlockFlag = false;
                            continue;
                        }
                        //Check flag and write to output
                        if (!commentBlockFlag)
                        {
                            dataOut.Add(dataRead[i]);
                        }
                    }
                    //Return result
                    data = dataOut.ToArray();
                    return true;
                }
                else
                {
                    //Directly return result
                    data = dataRead;
                    return true;
                }
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
